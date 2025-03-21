const Task = require('../models/task');

const taskController = {
  async createTask(req, res) {
    try {
      const { title, flagged, status } = req.body;
      const userId = req.user.id;

      const task = await Task.createTask({
        userId,
        title,
        flagged: flagged || false,
        status: status || 'todo'
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  async getTasks(req, res) {
    try {
      const userId = req.user.id;
      const tasks = await Task.getTasksByUserId(userId);
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { title, flagged, status } = req.body;

      const task = await Task.updateTask(id, userId, {
        ...(title && { title }),
        ...(flagged !== undefined && { flagged }),
        ...(status && { status })
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await Task.deleteTask(id, userId);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
};

module.exports = taskController; 