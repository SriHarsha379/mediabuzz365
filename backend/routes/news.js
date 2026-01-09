const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Protected route (Admin only)
router.post('/add-news', authMiddleware, (req, res) => {
  res.json({ message: 'News added successfully' });
});

module.exports = router;
