const express = require('express');
const app = express();


// TODO: Temporary while including mongo
let tasks = require('./mocks/tasks');
const TaskState = require('./types/states.enum');

// TODO: Include in .env
const port = 3005;

// Middlewares
app.use(express.json());  // for parsing application/json

// TODO: Initial mock endpoint
app.get('/tasks', (req,res) => {
  res.status(200).json([...tasks]);
});

app.get('/tasks/:id', (req,res) => {
  const { id } = req.params;
  const taskById = tasks.find(task => task.id === id);
  
  if (taskById) {
    return res.status(200).json(taskById)
  }

  res.status(404).json({ message: `Task ${id} not found`});
});

app.delete('/tasks/:id', (req,res) => {
  const { id } = req.params;
  const taskById = tasks.find(task => task.id === id);

  if (taskById) {
    tasks = tasks.filter( task => task.id !== id);
    return res.status(200).json({ message: `Task ${id} deleted` });   
  }

  res.status(404).json({ message: `Task ${id} not found`});
});

app.post('/tasks', (req, res) => {
  const { id, name, description, startDate, endDate } = req.body;
  const existingTask = tasks.find(task => task.id === id);

  if (existingTask) {
    return res.status(409).json({ message: `Taks ${id} already exists`});
  }

  tasks.push({
    id, 
    name, 
    description, 
    startDate, 
    endDate,
    state: TaskState.STARTED,
    logStates: [
      {
        startDate: new Date().toLocaleString(),
        state: TaskState.STARTED,
        endDate: null,
        justification: ''
      }
    ]
  });

  res.status(201).json({ message: `Task ${id} created`});
});

app.patch('/tasks/:id', (req,res) => {
  const { id } = req.params; 
  const { name, description, currentState, justification } = req.body;

  if (!id) {
    return res.status(404).json({ message: `Task ${id} not exists`});
  }

  let taskById = tasks.find(task => task.id === id);

  if (!taskById) {
    return res.status(404).json({ message: `Task ${id} not exists`});
  }

  const logStates = taskById.logStates;

  if (logStates.length > 0) {
    logStates.at(-1).endDate = new Date().toLocaleString();
  }

  logStates.push({
    startDate: new Date().toLocaleString(),
    state: currentState,
    endDate: null,
    justification: justification ?? ''
  })
  
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
});

app.get('/tasks/state/:id', (req,res) => {
  const { id } = req.params;
  const tasksByState = tasks.filter(task => task.currentState === id);

  if (!tasksByState) {
    return res.status(404).json({ message: `Task ${id} not exists`});
  }

  res.status(200).json(tasksByState);ß
});


// Listen on port
app.listen(port, (err) => {
  if (err) {
    return console.error('Error starting server: ', err);
  }

  console.info(`Task admin backend up and running on port ${port}`);
});
