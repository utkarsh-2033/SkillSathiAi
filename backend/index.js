// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const quizRoutes = require("./routes/quiz.routes");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(
    process.env.MONGO_URI
    // { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use("/api", quizRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
