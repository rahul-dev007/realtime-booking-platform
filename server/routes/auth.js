// server/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// আমাদের User মডেলটা এখানে নিয়ে আসি
const User = require('../models/User');

// --- 1. Registration Endpoint ---
// URL: POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // চেক করি এই ইমেইল দিয়ে আগে কেউ রেজিস্টার করেছে কিনা
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // নতুন ইউজার তৈরি করি
    user = new User({
      name,
      email,
      password,
      role, // role 'USER' or 'PROVIDER' frontend থেকে আসবে
    });

    // পাসওয়ার্ড হ্যাশ করি
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // ইউজারকে ডাটাবেসে সেভ করি
    await user.save();
    
    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- 2. Login Endpoint ---
// URL: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ইউজারকে খুঁজি
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // পাসওয়ার্ড মিলিয়ে দেখি
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // যদি সব ঠিক থাকে, একটা JWT টোকেন তৈরি করি
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // টোকেন ৭ দিন active থাকবে
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;