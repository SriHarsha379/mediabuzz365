console.log("ADMIN_PASSWORD =", process.env.ADMIN_PASSWORD);
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// store HASHED password
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("admin123", 10);

router.post("/login", async (req, res) => {
  const { password } = req.body;

  // ✅ compare plain password with hash
  const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // ✅ create JWT token
  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET || "SECRET_KEY",
    { expiresIn: "2h" }
  );

  res.json({ token });
});

module.exports = router;
