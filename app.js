const express = require('express');
const app = express();
const taskRoutes = require('./routes/task-controller-routes');
const authRoutes = require('./routes/auth-controller-routes');

// TODO: Include in .env
const port = 3001;

// Middlewares
app.use(express.json());  // for parsing application/json

// Task Management routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Listen on port
app.listen(port, (err) => {
  if (err) {
    return console.error('Error starting server: ', err);
  }

  console.info(`Task admin backend up and running on port ${port}`);
});
