const express = require("express");
const cors = require("cors");

require("dotenv").config(); // Load vars from .env
const app = express();

const taskRoutes = require("./routes/task-controller-routes");
const userRoutes = require("./routes/user-controller-routes");
const connectMongoDb = require("./db/mongodb-connection");

const PORT = process.env.PORT || 3000;

// Connect to mongodb database
connectMongoDb();

// Middlewares
app.use(express.json()); // for parsing application/json
app.use(cors()); // enable cors

// Task Management routes
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Listen on port
app.listen(PORT, (err) => {
  if (err) {
    return console.error("🔴 Error starting server: ", err);
  }

  console.info(`🟢 Task admin backend up and running on port ${PORT}`);
});
