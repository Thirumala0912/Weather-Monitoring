const cron = require("node-cron");
const Alert = require("../models/Alert");
const weatherService = require("../services/weatherService");
const transporter = require("./nodemailer");

// Run every 2 minutes
const setupCronJobs = () => {
  cron.schedule("*/2 * * * *", async () => {
    console.log("🔔 Checking alerts...");

    try {
      const alerts = await Alert.find();

      for (const alert of alerts) {
        try {
          // 🔥 FIX: clean city name
          const city = alert.city.trim().toLowerCase();

          console.log("Checking city:", city);

          const weather = await weatherService.fetchWeatherData(city);

          if (!weather || !weather.main) {
            console.log("❌ Invalid weather data for:", city);
            continue;
          }

          const currentTemp = weather.main.temp;

          console.log(
            `City: ${city}, Temp: ${currentTemp}, Threshold: ${alert.threshold}`
          );

          // 🔥 CONDITION CHECK
          if (currentTemp >= alert.threshold) {
            console.log("🔥 Condition met for", city);

            await transporter.sendMail({
              from: process.env.MAIL_ID,
              to: alert.email,
              subject: `🔥 Weather Alert for ${city}`,
              text: `Temperature reached ${currentTemp}°C (Threshold: ${alert.threshold}°C)`,
            });

            console.log("✅ Email sent to:", alert.email);

            // 🔥 OPTIONAL: remove alert after sending
            await Alert.deleteOne({ _id: alert._id });
          }
        } catch (err) {
          console.log("❌ Error processing alert:", alert.city);
        }
      }
    } catch (err) {
      console.error("❌ Cron job error:", err);
    }
  });
};

module.exports = setupCronJobs;