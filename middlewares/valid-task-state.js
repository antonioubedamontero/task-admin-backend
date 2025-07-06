const { isValidTaskState } = require("../helpers/valid-states");

const validateTaskState = (req, res, next) => {
  const { state } = req.params;

  const i18n = req.t;

  if (!state || !isValidTaskState(state)) {
    return res.status(400).json({
      message: i18n("invalidFields.invalidTaskState"),
    });
  }

  next();
};

module.exports = {
  validateTaskState,
};
