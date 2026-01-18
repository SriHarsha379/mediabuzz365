const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

 name:{type:String,required:true},
 email:{type:String,unique:true,required:true},
 password:{type:String,required:true},

 role:{
  type:String,
  enum:["super_admin","admin","editor","reporter"],
  default:"admin"
 },

 status:{
  type:String,
  enum:["active","blocked"],
  default:"active"
 },

 districts:{
  type:[String],
  default:[]
 },

 createdAt:{type:Date,default:Date.now},
 lastLogin:Date,
 lastIP:String
});

module.exports = mongoose.model("User", userSchema);

/* ================= MIDDLEWARE ================= */

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Verify super admin
const verifySuperAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Super admin only.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

/* ================= ROUTES ================= */

// GET ALL USERS (Super Admin Only)
router.get('/', verifySuperAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE NEW ADMIN (Super Admin Only)
router.post('/create-admin', verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'admin',
      status: 'active',
      districts: []
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status
      }
    });
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE DISTRICTS (Super Admin Only)
router.patch('/districts/:id', verifySuperAdmin, async (req, res) => {
  try {
    const { districts } = req.body;

    if (!Array.isArray(districts)) {
      return res.status(400).json({
        message: 'Districts must be an array'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow updating super admin districts
    if (user.role === 'super_admin') {
      return res.status(400).json({
        message: 'Cannot modify super admin districts'
      });
    }

    user.districts = districts;
    await user.save();

    const updatedUser = await User.findById(req.params.id).select('-password');

    res.json({
      message: 'Districts updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update districts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// BLOCK USER (Super Admin Only)
router.patch('/block/:id', verifySuperAdmin, async (req, res) => {
  try {
    // Prevent blocking yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cannot block your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent blocking other super admins
    if (user.role === 'super_admin') {
      return res.status(400).json({
        message: 'Cannot block super admin accounts'
      });
    }

    user.status = 'blocked';
    await user.save();

    const updatedUser = await User.findById(req.params.id).select('-password');

    res.json({
      message: 'User blocked successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Block user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ACTIVATE USER (Super Admin Only)
router.patch('/activate/:id', verifySuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'active';
    await user.save();

    const updatedUser = await User.findById(req.params.id).select('-password');

    res.json({
      message: 'User activated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Activate user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE USER (Super Admin Only)
router.delete('/:id', verifySuperAdmin, async (req, res) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting other super admins
    if (user.role === 'super_admin') {
      return res.status(400).json({
        message: 'Cannot delete super admin accounts'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET CURRENT USER INFO
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get user info error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE USER PROFILE (Self)
router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name.trim();
    await user.save();

    const updatedUser = await User.findById(req.user._id).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CHANGE PASSWORD (Self)
router.patch('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = mongoose.model("User", userSchema);
