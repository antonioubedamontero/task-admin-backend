// Specific routes for task management
const express = require("express");
const router = express.Router();

// Middleware
const validateAuthorization = require("../middlewares/authorization");
const {
  validateTaskUserOwnerShipByTaskId,
} = require("../middlewares/task-user-ownership");
const { validateTaskState } = require("../middlewares/valid-task-state");
const {
  createTaskRequiredFields,
  patchRequiredFields,
} = require("../middlewares/task-require-fields");

const {
  getTasks,
  getTaskById,
  createTask,
  deleteTaskById,
  updateTaskById,
  getTasksByState,
} = require("../controllers/task-controller");

router.get("/", [validateAuthorization], getTasks);

router.get(
  "/:taskId",
  [validateAuthorization, validateTaskUserOwnerShipByTaskId],
  getTaskById
);

router.delete(
  "/:taskId",
  [validateAuthorization, validateTaskUserOwnerShipByTaskId],
  deleteTaskById
);

router.post("/", [validateAuthorization, createTaskRequiredFields], createTask);

router.patch(
  "/",
  [
    validateAuthorization,
    validateTaskUserOwnerShipByTaskId,
    patchRequiredFields,
  ],
  updateTaskById
);

router.get(
  "/state/:state",
  [validateAuthorization, validateTaskState],
  getTasksByState
);

module.exports = router;
