// Specific routes for task management
const express = require('express');
const router = express.Router();

const { 
  getTasks, 
  getTaskById,
  createTask,
  deleteTaskById,
  updateTaskById,
  getTasksByState
} = require('../controllers/task-controller');

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.delete('/:id', deleteTaskById);
router.post('/', createTask);
router.patch('/:id', updateTaskById);
router.get('/state/:id', getTasksByState);

module.exports = router;
