const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const quizRoutes = require("./routes/quiz.routes");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const GkQuizRoutes = require("./routes/gkquiz.route.js");
const careerGoalsRoutes = require("./routes/careerGoals.route.js");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");
const initializeWebSocket = require("./websocket/websocket.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // React app URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose
  .connect(
    process.env.MONGO_URI // Use MongoDB URI from .env file
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// HTTP server and WebSocket setup
const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: {
    origin: "http://localhost:5173", // React app URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Initialize WebSocket logic
initializeWebSocket(io);

// Start the HTTP server

// Route to run ML model (server.py)
app.post("/mlmodel", (req, res) => {
  let options = { args: [JSON.stringify(req.body)] };
  PythonShell.run("MLmodel/server.py", options, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result.toString());
  });
});

// Detailed Feedback (detailedfeedback.py)
app.post("/detailed-feedback", (req, res) => {
  let options = { args: [JSON.stringify(req.body)] };
  PythonShell.run("MLmodel/detailedfeedback.py", options, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result.toString());
  });
});

// Route to get course recommendations (app.py)
app.post("/recommend", (req, res) => {
  let options = { args: [JSON.stringify(req.body)] };
  PythonShell.run("RecommendationModel/app.py", options, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result.toString());
  });
});

// Route to generate detailed learning path (learningpath.py)
app.post("/learning-path", (req, res) => {
  let options = { args: [JSON.stringify(req.body)] };
  PythonShell.run("RecommendationModel/learningpath.py", options, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result.toString());
  });
});

// Routes
app.use("/api", quizRoutes);
app.use("/api", authRoutes);
app.use("/user", userRoutes);
app.use("/api", careerGoalsRoutes);
app.use("/questions", GkQuizRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, message });
  next();
});

httpServer.listen(port,"0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});