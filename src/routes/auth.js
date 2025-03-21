const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');
const auth = require('../middleware/auth');

// Apple Sign In
router.post('/apple', async (req, res) => {
  try {
    const { appleId, email, name } = req.body;

    // Check if user already exists
    let user = await User.findByAppleId(appleId);
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      user = await User.createUser({ appleId, email, name });
      isNewUser = true;
    }

    // Generate JWT token
    const token = User.generateToken(user);

    // Create example tasks for new users
    if (isNewUser) {
      await Task.createExampleTasks(user.id);
    }

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router; 