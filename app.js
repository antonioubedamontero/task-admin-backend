const express = require("express");
const cors = require("cors");

require("dotenv").config(); // Load vars from .env
const { middleware } = require("./translations/i18next-init");

const app = express();

const taskRoutes = require("./routes/task-controller-routes");
const userRoutes = require("./routes/user-controller-routes");
const connectMongoDb = require("./db/mongodb-connection");
const { i18next } = require("./translations/i18next-init");

const PORT = process.env.PORT || 3000;

// Connect to mongodb database
connectMongoDb();

// Middlewares
app.use(express.json()); // for parsing application/json
app.use(middleware.handle(i18next)); // i18n translations
app.use(cors()); // enable cors

// Task Management routes
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Listen on port
app.listen(PORT, (err) => {
  if (err) {
    return console.error(i18next.t("catchedErrors.errorStartingServer"), err);
  }

  console.info(i18next.t("successfulMessages.serverRunning", { port: PORT }));
});
