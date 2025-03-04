// routes/user.js
const express = require('express');
const User = require('../models/user'); // import User model
const router = express.Router();

// POST route เพื่อบันทึกข้อมูลของผู้ใช้
router.post('/save', async (req, res) => {
  const { firstName, nickname, loginTime } = req.body;

  try {
    const newUser = new User({
      firstName,
      nickname,
      loginTime,
    });

    await newUser.save();
    res.status(200).json({ message: 'User saved successfully!' });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ message: 'Error saving user data', error });
  }
});

// GET route เพื่อดึงข้อมูลทั้งหมดจาก MongoDB
router.get('/getUserData', async (req, res) => {
  try {
    const users = await User.find(); // ดึงข้อมูลทั้งหมดจาก collection
    res.json(users);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});

module.exports = router;
