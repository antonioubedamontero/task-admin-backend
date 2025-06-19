const express = require('express');
require('dotenv').config(); // Load vars from .env

const app = express();
const taskRoutes = require('./routes/task-controller-routes');
const authRoutes = require('./routes/auth-controller-routes');
const connectMongoDb = require('./db/mongodb-connection');

const PORT = process.env.PORT || 3000;

// Connect to mongodb database
connectMongoDb();

// Middlewares
app.use(express.json());  // for parsing application/json

// Task Management routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Listen on port
app.listen(PORT, (err) => {
  if (err) {

    return console.error('🔴 Error starting server: ', err);
  }

  console.info(`🟢 Task admin backend up and running on port ${PORT}`);
});
