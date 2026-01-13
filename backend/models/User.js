const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["super_admin", "admin", "editor", "reporter"],
    default: "admin"
  },

  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  lastLogin: Date,

  // 🆕 Track actions
  lastIP: String

});

module.exports = mongoose.model("User", userSchema);
