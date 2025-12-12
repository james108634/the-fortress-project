const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, dob } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ ok: false, error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, name, dob });
    await user.save();

    res.json({ ok: true, message: 'Registered. Complete KYC to activate account.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ ok: false, error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ ok: false, error: 'Invalid password' });

    if (user.status !== 'verified') {
      return res.status(403).json({ ok: false, error: 'KYC not completed' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ ok: true, token });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
