const axios = require("axios");

// ✅ FIXED API KEY
const API_KEY = process.env.OPENWEATHER_API_KEY;

console.log("API KEY:", API_KEY);

// 🌤️ CITY WEATHER
exports.getCurrentWeather = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: req.params.city,
          appid: API_KEY, // ✅ FIXED
          units: "metric",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("City error:", error.response?.data || error.message);
    res.status(500).json({ error: "City fetch failed" });
  }
};

// 📍 EXACT LOCATION WEATHER
exports.getWeatherByCoords = async (req, res) => {
  const { lat, lon } = req.query;

  console.log("🔥 COORDS API HIT");
  console.log("📍 Lat:", lat, "Lon:", lon);

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          appid: API_KEY, // ✅ FIXED
          units: "metric",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Coords error:", error.response?.data || error.message);
    res.status(500).json({ error: "Coords fetch failed" });
  }
};