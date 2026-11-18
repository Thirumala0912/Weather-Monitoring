const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key";

// ✅ SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Signup request:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      cities: []
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN (🔥 FIXED PROPERLY)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // ✅ FIX 1: proper JSON response
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // ✅ FIX 2: proper JSON response
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    // ✅ FIX 3: clean response
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ ADD CITY
exports.addCity = async (req, res) => {
  const userId = req.user.id;
  const { city } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user.cities.includes(city)) {
      user.cities.push(city);
      await user.save();
    }

    res.json(user.cities);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ REMOVE CITY
exports.removeCity = async (req, res) => {
  const userId = req.user.id;
  const { city } = req.body;

  try {
    const user = await User.findById(userId);

    user.cities = user.cities.filter(c => c !== city);
    await user.save();

    res.json(user.cities);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ GET CITIES
exports.getCities = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    res.json(user.cities || []);
  } catch (err) {
    res.status(500).json(err);
  }
};