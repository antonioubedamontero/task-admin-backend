// Task management controllers
const TaskState = require('../types/states.enum')
const { changeState, isValidState } = require('../helpers/helper-functions');
const { v4: uuidv4 } = require('uuid');


// TODO: Temporary while including mongo
let tasks = require('../mocks/tasks');

const getTasks = (req,res) => {
  res.status(200).json([...tasks]);
};

const getTaskById = (req,res) => {
  const { id } = req.params;
  const taskById = tasks.find(task => task.id === id);
  
  if (taskById) {
    return res.status(200).json(taskById)
  }

  res.status(404).json({ message: `Task ${id} not found`});
};

const deleteTaskById = (req,res) => {
  const { id } = req.params;
  const taskById = tasks.find(task => task.id === id);

  if (taskById) {
    tasks = tasks.filter( task => task.id !== id);
    return res.status(200).json({ message: `Task ${id} deleted` });   
  }

  res.status(404).json({ message: `Task ${id} not found`});
}

const createTask = (req, res) => {
  const { name, description, startDate, dueDate } = req.body;

  const id = uuidv4();

  tasks.push({
    id, 
    name, 
    description, 
    startDate, 
    dueDate,
    state: TaskState.CREATED,
    logStates: [
      {
        startDate: new Date().toLocaleString(),
        state: TaskState.CREATED,
        endDate: null,
        justification: ''
      }
    ]
  });

  res.status(201).json({ message: `Task ${id} created`});
};

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

const getTasksByState = (req,res) => {
  const { id } = req.params;
  const tasksByState = tasks.filter(task => task.currentState === id);

  if (!tasksByState || tasksByState.length === 0) {
    return res.status(404).json({ message: `Task ${id} not exists`});
  }

  res.status(200).json(tasksByState);
}

module.exports = {
    getTasks,
    getTaskById,
    deleteTaskById,
    createTask,
    updateTaskById,
    getTasksByState
}
