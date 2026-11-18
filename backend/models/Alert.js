const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  userId: String, // 👈 important
  city: String,
  threshold: Number,
  email: String,
});

module.exports = mongoose.model("Alert", AlertSchema);