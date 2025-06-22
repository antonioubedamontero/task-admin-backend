// Specific routes for task management
const express = require('express');
const router = express.Router();

// Middleware
const validateAuthorization = require('../middlewares/authorization');
const { validateTaskUserOwnerShipByTaskId } = require('../middlewares/task-user-ownership');

const { 
  getTasks, 
  getTaskById,
  createTask,
  //deleteTaskById,
  //updateTaskById,
  //getTasksByState
} = require('../controllers/task-controller');

// TODO: This endpoint should be protected (admin only)
router.get('/', validateAuthorization, getTasks);

router.get('/:id', [validateAuthorization, validateTaskUserOwnerShipByTaskId] ,getTaskById);
//router.delete('/:id', [validateAuthorization, validateTaskUserOwnerShipByTaskId], deleteTaskById);
router.post('/', [validateAuthorization], createTask);
//router.patch('/:id', [validateAuthorization, validateTaskUserOwnerShipByTaskId], updateTaskById);

// TODO: This endpoint should have a different middleware
//router.get('/state/:id', getTasksByState);

module.exports = router;
