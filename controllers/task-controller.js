// Task management controllers
const mongoose = require("mongoose");
const { Task } = require("../db/schemas/task-schema");

const TaskState = require("../types/states.enum");
const { generateToken } = require("../helpers/json-webtokens");
const { taskMapperToJson } = require("../helpers/task-mapper");

const getTasks = async (req, res) => {
  const i18n = req.t;

  try {
    const { userId } = req;
    const userIdAsObject = new mongoose.Types.ObjectId(userId);
    const tasks = await Task.find({ userId: userIdAsObject });

    const mappedTasks = taskMapperToJson(tasks);

    if (!mappedTasks || mappedTasks.length === 0) {
      return res
        .status(404)
        .json({ message: i18n("notFoundErrors.tasksNotFound") });
    }

    // Renew session token
    res.status(200).json({
      tasks: [...mappedTasks],
      token: generateToken(userId),
    });
  } catch (error) {
    console.error(i18n("catchedErrors.errorGettingTasks"), error);
    return res
      .status(500)
      .json({ message: i18n("catchedErrors.internalServerError") });
  }
};

const getTaskById = async (req, res) => {
  const i18n = req.t;

  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ message: i18n("notFoundErrors.taskNotFound", { taskId }) });
    }

    const { userId, __v, ...data } = task.toJSON();

    // Renew session token
    res.status(200).json({
      task: data,
      token: generateToken(req.userId),
    });
  } catch (error) {
    console.error(i18n("catchedErrors.errorGettingTask"), error);
    return res
      .status(500)
      .json({ message: i18n("catchedErrors.internalServerError") });
  }
};

const deleteTaskById = async (req, res) => {
  const { taskId } = req.params;

  const i18n = req.t;

  try {
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      message: i18n("successfulMessages.taskDelete", { taskId }),
      token: generateToken(req.userId),
    });
  } catch (error) {
    console.error(i18n("catchedErrors.errorDeletingTasks"), error);
    return res
      .status(500)
      .json({ message: i18n("catchedErrors.internalServerError") });
  }
};

const createTask = async (req, res) => {
  const { userId } = req;
  const { name, description } = req.body;

  const userIdAsObject = new mongoose.Types.ObjectId(userId);

  const i18n = req.t;

  try {
    const taskFound = await Task.findOne({ name, userId: userIdAsObject });

    if (taskFound) {
      return res.status(409).json({
        message: i18n("invalidFields.taskExists", { name }),
      });
    }

    const newTask = {
      name,
      description,
      currentState: TaskState.CREATED,
      userId: userIdAsObject,
    };

    const task = new Task({ ...newTask });

    task.logStates = [
      {
        startDate: new Date(),
        state: TaskState.CREATED,
      },
    ];

    await task.save();

    const { __v, userId, ...data } = task.toJSON();

    // Renew session token
    res.status(201).json({
      data,
      token: generateToken(userId),
    });
  } catch (error) {
    console.error(i18n("catchedErrors.errorSavingTask"), error);
    return res
      .status(500)
      .json({ message: i18n("catchedErrors.internalServerError") });
  }
};

const updateTaskById = async (req, res) => {
  const {
    taskId,
    name,
    description,
    justification,
    currentState,
    startDate,
    dueDate,
  } = req.body;

  const i18n = req.t;

  try {
    const taskIdAsObject = new mongoose.Types.ObjectId(taskId);

    const taskFound = await Task.findById(taskIdAsObject);

    if (!taskFound) {
      return res
        .status(404)
        .json({ message: i18n("notFoundErrors.taskNotFound", { taskId }) });
    }

    taskFound.justification = justification;

    if (description) {
      taskFound.description = description;
    }

    if (name) {
      taskFound.name = name;
    }

    if (currentState) {
      taskFound.currentState = currentState;
    }

    if (startDate) {
      taskFound.startDate = new Date(startDate);
    }

    if (dueDate) {
      taskFound.dueDate = new Date(dueDate);
    }

    addNewEntryToTaskLogState(taskFound.logStates, currentState, justification);

    await taskFound.save();

    res.status(200).json({
      task: taskFound.toJSON(),
      token: generateToken(req.userId),
    });
  } catch (error) {
    console.error(i18n("catchedErrors.errorUpdatingTask"), error);
    return res
      .status(500)
      .json({ message: i18n("catchedErrors.internalServerError") });
  }
};

const getTasksByState = async (req, res) => {
  const { userId } = req;
  const { state } = req.params;

  const i18n = req.t;

  try {
    const userIdAsObject = new mongoose.Types.ObjectId(userId);
    const tasks = await Task.find({
      userId: userIdAsObject,
      currentState: state,
    });

    const mappedTasks = taskMapperToJson(tasks);

    if (!mappedTasks || mappedTasks.length === 0) {
      return res.status(404).json({
        message: i18n("notFoundErrors.tasksNotFoundByState", { state }),
      });
    }

    // Renew session token
    res.status(200).json({
      tasks: [...mappedTasks],
      token: generateToken(userId),
    });
  } catch (error) {
    console.error(i18n("catchedErrors.errorGettingTasksByState"), error);
    return res
      .status(500)
      .json({ message: i18n("catchedErrors.internalServerError") });
  }
};

const addNewEntryToTaskLogState = (logStates, currentState, justification) => {
  // Finish previous task date log state and add new log state
  const lastLogStatePosition = logStates.length - 1;
  logStates[lastLogStatePosition].endDate = new Date();

  logStates.push({
    startDate: new Date(),
    state: currentState,
    endDate: null,
    justification,
  });
};

module.exports = {
  getTasks,
  getTaskById,
  deleteTaskById,
  createTask,
  updateTaskById,
  getTasksByState,
};
