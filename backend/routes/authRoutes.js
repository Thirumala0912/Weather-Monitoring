const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  addCity,
  removeCity,
  getCities
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);

// 🔥 multi-city routes
router.post("/addCity", authMiddleware, addCity);
router.post("/removeCity", authMiddleware, removeCity);
router.get("/getCities", authMiddleware, getCities);

module.exports = router;