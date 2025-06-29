require("dotenv").config(); // Load vars from .env
const User = require("../db/schemas/user-schema");
const { generateToken } = require("../helpers/json-webtokens");
const jwt = require("jsonwebtoken");

const {
  codePassword,
  isValidPassword,
} = require("../helpers/password-encription");

const validateToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(200).json({ isValidToken: false });
    }

    res.status(200).json({ isValidToken: true });
  } catch (error) {
    console.error("🔴 Error validating token:", error);
    return res.status(200).json({ isValidToken: false });
  }
};

const userAvailability = async (req, res) => {
  const { email } = req.params;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(200).json({ isAvaileble: true });
    }

    res.status(200).json({ isAvaileble: false });
  } catch (error) {
    console.error("🔴 Error getting user availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res
        .status(401)
        .json({ message: `User ${email} is not authorized` });
    }

    const isPasswordOk = isValidPassword(password, userFound.password);

    if (!isPasswordOk) {
      return res
        .status(401)
        .json({ message: `User ${email} is not authorized` });
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
    console.error("🔴 Error getting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, name, surname } = req.body;

    const userFound = await User.findOne({ email });

    if (userFound) {
      return res.status(409).json({ message: `User ${email} already exists` });
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
    console.error("🔴 Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUser,
  createUser,
  userAvailability,
  validateToken,
};
