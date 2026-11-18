const axios = require("axios");
const nodemailer = require("nodemailer");

const API_KEY = process.env.OPENWEATHER_API_KEY;

// 📧 mail setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.APP_PASS,
  },
});

const setAlert = async (req, res) => {
  try {
    const { city, threshold, email } = req.body;

    console.log("Alert data:", req.body);

    // 🔥 get current weather
    const weather = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    const currentTemp = weather.data.main.temp;

    console.log("Current Temp:", currentTemp);

    // 🔥 check condition
    if (currentTemp >= threshold) {
      // 📧 send email
      await transporter.sendMail({
        from: process.env.MAIL_ID,
        to: email,
        subject: "Weather Alert 🚨",
        text: `Temperature in ${city} is ${currentTemp}°C which crossed your threshold (${threshold}°C)`,
      });

      return res.json({
        message: "Alert triggered & email sent",
        currentTemp,
      });
    }

    res.json({
      message: "Alert set, but condition not met",
      currentTemp,
    });

  } catch (err) {
    console.error("Alert error:", err);
    res.status(500).json({ error: "Failed to set alert" });
  }
};

module.exports = { setAlert };