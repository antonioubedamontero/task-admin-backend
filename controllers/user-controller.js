require("dotenv").config(); // Load vars from .env

const User = require("../db/schemas/user-schema");
const { generateToken } = require("../helpers/json-webtokens");

const {
  codePassword,
  isValidPassword,
} = require("../helpers/password-encription");

const { getDecodedToken } = require("../helpers/json-webtokens");

const validateToken = async (req, res) => {
  const i18n = req.t;

  const { token } = req.body;
  const decodedToken = getDecodedToken(token);

  if (!decodedToken) {
    return res.status(200).json({ isValidToken: false });
  }

  res.status(200).json({ isValidToken: true });
};

const userAvailability = async (req, res) => {
  const { email } = req.params;

  const i18n = req.t;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(200).json({ isAvailable: true });
    }

    res.status(200).json({ isAvailable: false });
  } catch (error) {
    console.error(i18n("catchedErrors.userAvailability"), error);
    return res
      .status(500)
      .json({ message: i18n("catchedErrors.internalServerError") });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const i18n = req.t;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(401).json({
        message: i18n("authorizationErrors.userNotAuthorized", { email }),
      });
    }

    const isPasswordOk = isValidPassword(password, userFound.password);

    if (!isPasswordOk) {
      return res.status(401).json({
        message: i18n("authorizationErrors.userNotAuthorized", { email }),
      });
    }

    /* eslint-disable no-unused-vars */
    const { password: passwd, __v, ...userData } = userFound.toJSON();

    // Generate a new token to keep session alive
    res.status(200).json({
      user: {
        ...userData,
      },
      token: generateToken(userFound._id),
    });
  } catch (error) {
    console.error(i18n("catchedErrors.errorGettingUser"), error);
    return res
      .status(500)
      .json({ message: i18n("catchedErrors.internalServerError") });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, name, surname } = req.body;
    const i18n = req.t;

    const userFound = await User.findOne({ email });

    if (userFound) {
      return res
        .status(409)
        .json({ message: i18n("requiredFieldsErrors.emailTaken", { email }) });
    }

    const user = new User({ email, password, name, surname });
    user.password = codePassword(password);

    const { password: passwd, __v, ...userData } = user.toJSON();

    await user.save();

    return res.status(201).json({
      user: {
        ...userData,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(i18n("catchedErrors.errorCreatingUser"), error);
    return res
      .status(500)
      .json({ message: i18n("catchedErrors.internalServerError") });
  }
};

module.exports = {
  login,
  register,
  userAvailability,
  validateToken,
};
