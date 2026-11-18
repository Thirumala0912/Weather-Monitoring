require("dotenv").config({ path: "./backend/.env" });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ✅ CONNECT TO ATLAS
mongoose.connect("mongodb+srv://RajathRKumar:123Twist123@cluster0.0pxwvh1.mongodb.net/weatherApp?retryWrites=true&w=majority")
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ROUTES
const weatherRoutes = require("./routes/weatherRoutes");
const authRoutes = require("./routes/authRoutes");
const alertRoutes = require("./routes/alertRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
app.use(cors());
app.use(express.json());

app.use("/api", weatherRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", alertRoutes);
app.use("/api", summaryRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});