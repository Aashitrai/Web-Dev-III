// Modular Routing - saare student routes yaha hain
const express = require("express");
const router = express.Router();
const students = require("../data/students");

// Naye student ke liye id (3 students already hain, isliye 4 se start)
let nextId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;

// 1) GET /students - saare students
router.get("/", (req, res) => {
  res.status(200).json(students);
});

// 2) GET /students/:id - ek student
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid student id" });
  }

  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(student);
});

// 3) POST /students - naya student add karo
router.post("/", (req, res) => {
  const body = req.body || {};
  const name = body.name;
  const course = body.course;

  if (!name || !course || typeof name !== "string" || typeof course !== "string") {
    return res.status(400).json({ message: "name and course are required" });
  }

  const newStudent = { id: nextId++, name: name.trim(), course: course.trim() };
  students.push(newStudent);

  res.status(201).json(newStudent);
});

// 4) PUT /students/:id - student update karo
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid student id" });
  }

  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const body = req.body || {};
  const name = body.name;
  const course = body.course;

  if (!name || !course || typeof name !== "string" || typeof course !== "string") {
    return res.status(400).json({ message: "name and course are required" });
  }

  student.name = name.trim();
  student.course = course.trim();

  res.status(200).json(student);
});

// 5) DELETE /students/:id - student delete karo
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid student id" });
  }

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const deletedStudent = students.splice(index, 1)[0];

  res.status(200).json({ message: "Student deleted successfully", student: deletedStudent });
});

module.exports = router;
