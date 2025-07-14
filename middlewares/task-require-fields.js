const {
  isValidTaskState,
  isValidObjectId,
} = require("../helpers/valid-states");
const { Task } = require("../db/schemas/task-schema");
const TaskState = require("../types/states.enum");

const createTaskRequiredFields = (req, res, next) => {
  const { name, description } = req.body;

  const i18n = req.t;

  if (!name || !description) {
    return res.status(400).json({
      message: i18n("requiredFieldsErrors.createTaskRequireFields"),
    });
  }

  next();
};

const patchRequiredFields = async (req, res, next) => {
  const { currentState, startDate, dueDate } = req.body;

  const i18n = req.t;

  try {
    // Common patch validations
    await validateCommonPatchFields(req, res);

    // Validate name and description
    await validateNameDescription(req, res);

    // Dates validations
    if (currentState === TaskState.STARTED) {
      await verifyDates(req, res);
    } else {
      if (startDate || dueDate) {
        return res.status(400).json({
          message: i18n("requiredFieldsErrors.datesModifiableIfStarted"),
        });
      }
    }
    next();
  } catch (error) {
    return error;
  }
};

const validateNameDescription = (req, res) => {
  return new Promise((resolve, reject) => {
    const { name, description } = req.body;

    if (name && name.length === 0) {
      return reject(
        res.status(400).json({
          message: i18n("requiredFieldsErrors.nameIsEmpty"),
        })
      );
    }

    if (description && description.length === 0) {
      return reject(
        res.status(400).json({
          message: i18n("requiredFieldsErrors.descriptionIsEmpty"),
        })
      );
    }

    resolve("ok");
  });
};

const validateCommonPatchFields = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const { taskId, currentState, justification } = req.body;

    const i18n = req.t;

    if (!taskId || !isValidObjectId(taskId)) {
      return reject(
        res.status(400).json({
          message: i18n("requiredFieldsErrors.idRequired"),
        })
      );
    }

    if (!justification) {
      return reject(
        res.status(400).json({
          message: i18n("requiredFieldsErrors.justificationRequired"),
        })
      );
    }

    if (currentState && !isValidTaskState(currentState)) {
      return reject(
        res.status(400).json({
          message: i18n("invalidFields.invalidTaskState"),
        })
      );
    }

    resolve("ok");
  });
};

const verifyDates = (req, res) => {
  // Validations for started task state
  const i18n = req.t;

  return new Promise(async (resolve, reject) => {
    try {
      let { taskId, startDate, dueDate } = req.body;

      const task = await Task.findById(taskId);

      if (!task) {
        return reject(
          res
            .status(404)
            .json({ message: i18n("notFoundErrors.taskNotFound", { taskId }) })
        );
      }

      const { startDate: prevStartDate, dueDate: prevDueDate } = task.toJSON;
      const isPreviousDateSaved = prevStartDate && prevDueDate;

      if (!isPreviousDateSaved && (!startDate || !dueDate)) {
        return reject(
          res.status(400).json({
            message: i18n("requiredFieldsErrors.datesModificationRequired"),
          })
        );
      }

      const startDateAsDate = new Date(startDate);
      const dueDateAsDate = new Date(dueDate);

      if (startDateAsDate > dueDateAsDate) {
        return reject(
          res.status(400).json({
            message: i18n("requiredFieldsErrors.startDateGreaterThanEndDate"),
          })
        );
      }

      resolve("ok");
    } catch (error) {
      reject(
        res
          .status(500)
          .json({ message: i18n("catchedErrors.internalServerError") })
      );
    }
  });
};

module.exports = {
  createTaskRequiredFields,
  patchRequiredFields,
};
