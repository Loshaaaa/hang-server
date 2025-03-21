const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all tasks for the authenticated user
router.get('/', taskController.getTasks);

// Create a new task
router.post('/', taskController.createTask);

// Update a task
router.patch('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router; 