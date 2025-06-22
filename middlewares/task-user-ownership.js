// Previously called validateAuthorization middleware
const mongoose = require('mongoose');
const { Task } = require('../db/schemas/task-schema');

const validateTaskUserOwnerShipByTaskId = async(req, res, next) => {
    const { id } = req.params;

    try {
      const taskFound = await Task.findById(id);

      if (!taskFound) {
        return res.status(404).send(
          { message: 'task not found' }
        );
      }

      const { userId } = taskFound.toJSON();
      const reqIdAsObject = new mongoose.Types.ObjectId(req.id);

      if (!userId.equals(reqIdAsObject)) {
        return res.status(403).send(
          { message: 'resource is not property of user' }
        );
      }
      
      next();

    } catch (error) {
      console.error('🔴 Error validating task ownership:', error);
      return res.status(500).send(
        { message: 'Internal server error' }
      );      
    }
}

module.exports = {
  validateTaskUserOwnerShipByTaskId
}; 