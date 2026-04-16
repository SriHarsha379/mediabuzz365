const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
 action: String,
 performedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
 },
 target: String,
 time: {
  type: Date,
  default: Date.now
 }
});

module.exports = mongoose.model("Audit", auditSchema);
