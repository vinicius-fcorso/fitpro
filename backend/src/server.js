const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const studentRoutes = require("./routes/studentRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/workouts", workoutRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FitPro API funcionando!"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 FitPro API rodando em http://localhost:${PORT}`);
});