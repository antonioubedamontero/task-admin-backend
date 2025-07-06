// Previously called validateAuthorization middleware
const mongoose = require("mongoose");

const { isValidObjectId } = require("../helpers/object-id");
const { Task } = require("../db/schemas/task-schema");

const validateTaskUserOwnerShipByTaskId = async (req, res, next) => {
  let { taskId } = req.params;

  if (!taskId) {
    taskId = req.body;
  }

  const i18n = req.t;

  if (!isValidObjectId(taskId)) {
    return res.status(400).json({
      message: i18n("invalidFields.taskIdInvalid"),
    });
  }

  const taskFound = await Task.findById(taskId);

  if (!taskFound) {
    return res
      .status(404)
      .send({ message: i18n("notFoundErrors.taskNotFound", { taskId }) });
  }

  const { userId } = taskFound.toJSON();

  const reqIdAsObject = new mongoose.Types.ObjectId(req.userId);

  if (!userId.equals(reqIdAsObject)) {
    return res.status(403).send({
      message: i18n("authorizationErrors.taskNotUserProperty", { taskId }),
    });
  }

  next();
};

module.exports = {
  validateTaskUserOwnerShipByTaskId,
};
