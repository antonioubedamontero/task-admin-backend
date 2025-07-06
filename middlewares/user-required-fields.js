const loginRequiredFields = (req, res, next) => {
  const { email, password } = req.body;

  const i18n = req.t;

  if (!email || !password) {
    return res.status(400).json({
      message: i18n("requiredFieldsErrors.loginFieldsRequired"),
    });
  }

  next();
};

const validateTokenRequiredFields = (req, res, next) => {
  const { token } = req.body;

  const i18n = req.t;

  if (!token) {
    return res.status(400).json({
      message: i18n("requiredFieldsErrors.validateTokenRequiredFields"),
    });
  }

  next();
};

const userAvailabilityRequiredFields = (req, res, next) => {
  const { email } = req.params;

  const i18n = req.t;

  if (!email) {
    return res.status(400).json({
      message: i18n("requiredFieldsErrors.userAvailabilityRequiredFields"),
    });
  }

  next();
};

const registerRequiredFields = (req, res, next) => {
  const { email, password, name, surname } = req.body;

  const i18n = req.t;

  if (!email || !password || !name || !surname) {
    return res.status(400).json({
      message: i18n("requiredFieldsErrors.registerRequiredFields"),
    });
  }

  next();
};

module.exports = {
  loginRequiredFields,
  validateTokenRequiredFields,
  userAvailabilityRequiredFields,
  registerRequiredFields,
};
