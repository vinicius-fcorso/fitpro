const express = require("express");

const {
  createWorkout,
  getMyWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
} = require("../controllers/workoutController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createWorkout);
router.get("/", authMiddleware, getMyWorkouts);
router.get("/:id", authMiddleware, getWorkoutById);
router.put("/:id", authMiddleware, updateWorkout);
router.delete("/:id", authMiddleware, deleteWorkout);

module.exports = router;