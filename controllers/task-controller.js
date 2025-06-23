// Task management controllers
const mongoose = require('mongoose');

const TaskState = require('../types/states.enum')
const { generateToken } = require('../helpers/json-webtokens');
const { Task } = require('../db/schemas/task-schema');

const getTasks = async(req,res) => {
  try {
    const { id } = req;
    const userIdAsObject = new mongoose.Types.ObjectId(id);
    const tasks = await Task.find({ userId: userIdAsObject });

    const mappedTasks = tasks.map(task => {
      /* eslint-disable no-unused-vars */
      const { userId, __v, token, ...data } = task.toJSON();
      return data;
    });

    if (!mappedTasks || mappedTasks.length === 0) {
      return res.status(404).json(
        { message: 'No tasks found by provide user'}
      );
    }

    // Renew session token
    res.status(200).json({
      tasks: [...mappedTasks],
      token: generateToken(id) 
    });
    
  } catch (error) {
    console.error('🔴 Error getting tasks:', error);
    return res.status(500).json(
      { message: 'Internal server error' }
    );    
  }
};

const getTaskById = async (req,res) => {
  try {
    const { id } = req.params; 
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json(
        { message: `No task found with id ${id}`}
      );
    }

    const { userId, __v, ...data  } = task.toJSON();

    // Renew session token
    res.status(200).json({
      task: data,
      token: generateToken(req.id) 
    });
    
  } catch (error) {
    console.error('🔴 Error getting task:', error);
    return res.status(500).json(
        { message: 'Internal server error' }
    );    
  }
};

const deleteTaskById = async(req,res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      message: `Task ${id} deleted successfully`,
      token: generateToken(req.id)
    });
    
  } catch (error) {
    console.error('🔴 Error deleting task:', error);
    return res.status(500).json(
      { message: 'Internal server error' }
    );
  }
}

const createTask = async(req, res) => {
  const { name, description, startDate, dueDate } = req.body;
  const { id } = req;

  const userIdAsObject = new mongoose.Types.ObjectId(id);

  try {
    const taskFound = await Task.findOne(
      { name, userId: userIdAsObject }
    );

    if (taskFound) {
      return res.status(409).json(
        { message: `task with name ${name} already exists for current user` }
      );
    }

    const task = new Task({ name, description, startDate, dueDate });

    task.startDate = new Date(startDate)?.toJSON();
    task.dueDate = new Date(dueDate)?.toJSON();
    task.userId = userIdAsObject;
    task.currentState = TaskState.BACKLOG;
    task.logStates = [
      { 
        startDate: new Date().toJSON(),
        state: TaskState.BACKLOG,
        endDate: null          
      }
    ]

    await task.save();

    const { __v, userId, ...data } = task.toJSON();

    // Renew session token
    res.status(201).json({
      data,
      token: generateToken(id)
    });

  } catch (error) {
     console.error('🔴 Error saving user:', error);
     return res.status(500).json(
        { message: 'Internal server error' }
     );
  }
};


const updateTaskById = async(req,res) => {
  const { id } = req.params; 
  const { name, description, currentState, justification } = req.body;

  try {
    const taskFound = await Task.findById(id);

    if (!taskFound) {
      return res.status(404).json(
        { message: `Task ${id} not exists`}
      );
    }

    // TODO: No need to send state if only changes name and/or description
    // TODO: Validate that states are valid
    if (currentState === taskFound.currentState) {
      // Only changes name and/or description
      if (!name && !description) {
        return res.status(400).json(
          { message: 'status is not changed and missing name or description' }
        )    
      }

      taskFound.name = name ? name : taskFound.name;
      taskFound.description = description ? description : taskFound.description;

      await taskFound.save();

      return res.status(200).json({
        task: taskFound.toJSON(),
        token: generateToken(req.id)
      });
    }
    
    if (!justification) {
      return res.status(400).json(
        { message: 'justification is required when changing state' }
      ); 
    }

    taskFound.currentState = currentState;

    // Finish previous task date log state and add new log state
    const lastLogStatePosition = taskFound.logStates.length - 1;
    taskFound.logStates[lastLogStatePosition].endDate = new Date().toJSON();
    taskFound.logStates.push(
      {
        startDate: new Date().toJSON(),
        state: currentState,
        endDate: null,
        justification
      }
    );

    await taskFound.save();

    res.status(200).json({
        task: taskFound.toJSON(),
        token: generateToken(req.id)
    });

  } catch (error) {
    console.error('🔴 Error updating task:', error);
    return res.status(500).json(
      { message: 'Internal server error' }
    );   
  }
};

const getTasksByState = async(req,res) => {
  try {
    const { id } = req;
    const { id:state } = req.params;

    const userIdAsObject = new mongoose.Types.ObjectId(id);
    const tasks = await Task.find({ userId: userIdAsObject, currentState: state });

    const mappedTasks = tasks.map(task => {
      const { userId, __v, token, ...data } = task.toJSON();
      return data;
    });

    if (!mappedTasks || mappedTasks.length === 0) {
      return res.status(404).json(
        { message: `No tasks found for user with state ${state}`}
      );
    }

    // Renew session token
    res.status(200).json({
      tasks: [...mappedTasks],
      token: generateToken(id) 
    });
    
  } catch (error) {
    console.error('🔴 Error getting tasks by state:', error);
    return res.status(500).json(
      { message: 'Internal server error' }
    );    
  }
}

module.exports = {
    getTasks,
    getTaskById,
    deleteTaskById,
    createTask,
    updateTaskById,
    getTasksByState
}
