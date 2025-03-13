const express = require('express');
const User = require('../models/user'); // import User model
const router = express.Router();

// POST route to save user data
router.post('/save', async (req, res) => {
  const { firstName, lastName, loginTime, status } = req.body;

  try {
    const newUser = new User({
      firstName,
      lastName,
      loginTime: new Date(loginTime), // Ensure it's a Date object
      status, 
    });

    await newUser.save();
    res.status(200).json({ message: 'User saved successfully!' });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ message: 'Error saving user data', error });
  }
});

// POST route to save logout time
router.post('/saveLogoutTime', async (req, res) => {
  const { firstName, lastName, loginTime, logoutTime } = req.body;

  try {
    const user = await User.findOne({ firstName, lastName, loginTime: new Date(loginTime) });

    if (user) {
      user.logoutTime = new Date(logoutTime); // Save logout time as Date object
      await user.save();
      res.status(200).json({ message: 'Logout time saved successfully!' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error saving logout time:', error);
    res.status(500).json({ message: 'Error saving logout time', error });
  }
});

// GET route to fetch all user data
router.get('/getUserData', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all user data
    res.json(users);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});

module.exports = router;
