const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../config/email');

// Generate JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// 🧩 REGISTER (Admin or User)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: 'Email already registered' });

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) return res.status(400).json({ message: 'Phone number already registered' });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 LOGIN (User or Admin)
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    
    // Check if it's an email or phone number
    const isEmail = emailOrPhone.includes('@');
    
    let user;
    if (isEmail) {
      user = await User.findOne({ email: emailOrPhone.toLowerCase() });
    } else {
      user = await User.findOne({ phone: emailOrPhone });
    }

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/phone or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 ADMIN LOGIN (optional separate endpoint)
router.post('/admin/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    
    // Check if it's an email or phone number
    const isEmail = emailOrPhone.includes('@');
    
    let admin;
    if (isEmail) {
      admin = await User.findOne({ email: emailOrPhone.toLowerCase(), role: 'admin' });
    } else {
      admin = await User.findOne({ phone: emailOrPhone, role: 'admin' });
    }
    
    if (admin && (await admin.comparePassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 PROFILE (Private)
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// 🧩 UPDATE PROFILE (Private)
router.put('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  if (req.body.addresses) user.addresses = req.body.addresses;
  if (req.body.password) user.password = req.body.password;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    addresses: updatedUser.addresses,
    token: generateToken(updatedUser._id),
  });
});

// 🧩 GET ALL USERS (Admin only)
router.get('/all-users', protect, admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// 🧩 DELETE USER (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  res.json({ message: 'User deleted successfully' });
});

// 🧩 FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      // Send password reset email
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      
      res.json({
        message: 'Password reset email sent successfully. Please check your email for instructions.',
      });

    } catch (emailError) {
      // If email fails, clean up the reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      console.error('Email send error:', emailError);
      
      // In development, still provide the token if email fails
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          message: 'Email service unavailable. Here is your reset token for development:',
          resetToken,
          resetUrl: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        });
      }

      return res.status(500).json({ 
        message: 'Email could not be sent. Please try again later.' 
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// 🧩 RESET PASSWORD
router.put('/reset-password/:resettoken', async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: 'Password reset successful',
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
