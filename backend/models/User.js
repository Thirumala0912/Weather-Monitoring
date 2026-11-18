const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cities: [String], // multi-city support
  alerts: {
    temperature: Number,
    rain: Boolean,
    wind: Number
  }
});

module.exports = mongoose.model("User", userSchema);