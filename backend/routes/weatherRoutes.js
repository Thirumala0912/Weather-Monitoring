const express = require("express");
const router = express.Router();

const weatherController = require("../controllers/weatherController");

console.log("✅ weatherRoutes loaded");

// 📍 IMPORTANT: coords FIRST
router.get("/weather/coords", weatherController.getWeatherByCoords);

// 🌤️ city weather
router.get("/weather/:city", weatherController.getCurrentWeather);
console.log("Controller:", weatherController);
module.exports = router;