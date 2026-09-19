const express = require("express");

const {
  createStudent,
  getMyStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createStudent);
router.get("/", authMiddleware, getMyStudents);
router.get("/:id", authMiddleware, getStudentById);
router.put("/:id", authMiddleware, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);

module.exports = router;