const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY;

// 🔥 GET DAILY SUMMARY
const getSummary = async (req, res) => {
  try {
    const { city } = req.params;

    // 🌤️ Fetch weather from OpenWeather API
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    const data = response.data;

    // ✅ FORMAT DATA (MATCH FRONTEND EXPECTATION)
    const summary = {
      date: new Date().toISOString(),

      avgTemp: data.main.temp,
      maxTemp: data.main.temp,
      minTemp: data.main.temp,

      avgHumidity: data.main.humidity,
      avgWindSpeed: data.wind.speed,

      condition: data.weather[0].description,
    };

    // ✅ IMPORTANT: return ARRAY
    res.json([summary]);

  } catch (err) {
    console.error(
      "Summary error:",
      err.response?.data || err.message
    );

    res.status(500).json({
      error: "Failed to fetch summary",
    });
  }
};

module.exports = { getSummary };