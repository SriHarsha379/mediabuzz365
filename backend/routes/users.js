const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
console.log("🔥 USERS ROUTES LOADED");
console.log("JWT SECRET =", process.env.JWT_SECRET);

/* ================= MIDDLEWARE ================= */

// Verify super admin
const verifySuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Super admin only.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

/* ================= ROUTES ================= */

// TEST ROUTE
router.get('/test', (req, res) => {
  res.json({ message: 'Users API is working!' });
});

// GET ALL USERS
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

// CREATE NEW ADMIN
router.post('/create-admin', verifySuperAdmin, async (req, res) => {
  try {
    console.log('Create admin request received:', req.body);

    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Validate password
    if (password.length < 4) {
      return res.status(400).json({
        message: 'Password must be at least 4 characters'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'admin',
      status: 'active',
      districts: []
    });

    await newAdmin.save();

    console.log('Admin created successfully:', newAdmin.email);

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
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});

// UPDATE DISTRICTS
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

// BLOCK USER
router.patch('/block/:id', verifySuperAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cannot block your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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

// ACTIVATE USER
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

// DELETE USER
router.delete('/:id', verifySuperAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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

// GET LOGGED IN USER
router.get("/me", async (req, res) => {
 try{
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({msg:"No token"});

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id)
   .select("-password");

  res.json(user);

 }catch(err){
  res.status(401).json({msg:"Invalid token"});
 }
});


module.exports = router;