const { isValidTaskState } = require("../helpers/valid-states");
const { TaskState } = require("../types/states.enum");
const { Task } = require("../db/schemas/task-schema");

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
  } catch (error) {
    return error;
  }

  next();
};

const validateCommonPatchFields = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const { currentState, justification } = req.body;

    const i18n = req.t;

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
  // Validations for started tsk state
  return new Promise(async (resolve, reject) => {
    try {
      let { id, startDate, dueDate } = req.body;

      const task = await Task.findById(id);

      if (!task) {
        return reject(
          res
            .status(404)
            .json({ message: i18n("notFoundErrors.taskNotFound", { id }) })
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
