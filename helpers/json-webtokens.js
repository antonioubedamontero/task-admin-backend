require("dotenv").config(); // Load vars from .env
const jwt = require("jsonwebtoken");

const generateToken = (userId) =>
  jwt.sign(
    {
      payload: userId,
    },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "1h" }
  );

const getDecodedToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

module.exports = {
  generateToken,
  getDecodedToken,
};
