// Express Server - main file
const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json()); // JSON body padhne ke liye
app.use(logger);         // Custom logger

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Student Management REST API is running" });
});
app.use("/students", studentRoutes);

// Unknown route -> 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (4 parameters zaroori hain)
app.use((err, req, res, next) => {
  // Galat JSON bheja ho to 400
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON" });
  }
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
