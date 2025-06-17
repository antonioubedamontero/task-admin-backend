const express = require('express');
const app = express();

// TODO: Temporary while including mongo
const tasks = require('./mocks/tasks');

// TODO: Include in .env
const port = 3002;

// TODO: Initial mock endpoint
app.get('/tasks', (req,res) => {
  console.log('tasks', tasks);
  res.status(200).json([...tasks]);
});

// Listen on port
app.listen(port, (err) => {
  if (err) {
    return console.error('Error starting server: ', err);
  }

  console.info(`Task admin backend up and running on port ${port}`);
});
