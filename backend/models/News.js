const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({

  state: String,
  city: String,

  category: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: String,
  image: String,
  liveId: String,

  // 🆕 Approval system
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("News", newsSchema);
