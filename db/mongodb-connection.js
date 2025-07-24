const mongoose = require("mongoose");
require("dotenv").config(); // Load variables from .env

const { MONGO_URI } = process.env;

const connectMongoDb = () => {
  mongoose
    .connect(MONGO_URI || "mongodb://localhost:27017/taskdb")
    .then(() => {
      console.log("🟢 Connected to database");
    })
    .catch((err) => {
      console.error("🔴 Connection error:", err);
    });
};

module.exports = connectMongoDb;
