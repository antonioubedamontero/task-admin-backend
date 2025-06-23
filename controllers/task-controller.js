// Task management controllers
const mongoose = require('mongoose');

const TaskState = require('../types/states.enum')
const { generateToken } = require('../helpers/json-webtokens');
const { changeState, isValidState } = require('../helpers/helper-functions');
const { Task } = require('../db/schemas/task-schema');

const getTasks = async(req,res) => {
  try {
    const { id } = req;
    const userIdAsObject = new mongoose.Types.ObjectId(id);
    const tasks = await Task.find({ userId: userIdAsObject });

    const mappedTasks = tasks.map(task => {
      const { userId, __v, token, ...data } = task.toJSON();
      return data;
    });

    if (!mappedTasks || mappedTasks.length === 0) {
      return res.status(404).json(
        { message: 'No tasks found by user'}
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
      return res.status(404).json({ message: 'No task found'});
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
      message: `Task deleted successfully`,
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
        { message: 'task already exists for current user' }
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

/*
// FIX: Name and status is not being modified
const updateTaskById = (req,res) => {
  const { id } = req.params; 
  const { name, description, currentState, justification } = req.body;

  if (!id) {
    return res.status(404).json({ message: `Task ${id} not exists`});
  }

  let taskById = tasks.find(task => task.id === id);

  if (!taskById) {
    return res.status(404).json({ message: `Task ${id} not exists`});
  }

  if (!isValidState(currentState)) {
    return res.status(400).json({ message: 'state is not valid' });
  }

  const logStates = taskById.logStates;
  changeState(logStates, currentState, justification);

  taskById = {
    ...taskById,
    name,
    description,
    currentState,
    logStates
  }

  return res.status(200).json({
    message: `Task ${id} updated`,
    data: taskById
  })
};
*/

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
        { message: 'No tasks found by user and state'}
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
    // updateTaskById,
    getTasksByState
}
