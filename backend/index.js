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
const initializeWebSocket = require("./websocket/websocket.js");
const socketIo = require("socket.io");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose
  .connect(
    process.env.MONGO_URI
    // { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const httpServer = http.createServer(app);

const io = socketIo(httpServer, {
  cors: {
    origin: "http://localhost:5173",  
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  }
});

// Call your WebSocket initialization function
initializeWebSocket(io);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api", quizRoutes);
app.use("/api", authRoutes);
app.use("/user", userRoutes);
app.use("/api", careerGoalsRoutes);
app.use("/gkquiz", GkQuizRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, message });
  next();
});
