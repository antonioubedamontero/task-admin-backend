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

const getDecodedToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  generateToken,
  getDecodedToken,
};
