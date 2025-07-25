const { isValidTaskState } = require("../helpers/valid-states");
const { isValidObjectId } = require("../helpers/object-id");
const verifyDates = require("../helpers/verify-dates");

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

    const i18n = req.t;

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
  return new Promise((resolve, reject) => {
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

module.exports = {
  createTaskRequiredFields,
  patchRequiredFields,
};
