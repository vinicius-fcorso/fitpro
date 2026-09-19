const express = require("express");

const {
  getMyTrainer,
  getDashboard
} = require("../controllers/trainerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getMyTrainer);
router.get("/dashboard", authMiddleware, getDashboard);

module.exports = router;