const mongoose = require("mongoose");

const isValidObjectId = (objectId) => {
  return mongoose.isValidObjectId(objectId);
};

module.exports = {
  isValidObjectId,
};
