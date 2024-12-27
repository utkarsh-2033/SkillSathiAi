// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const quizRoutes = require("./routes/quiz.routes");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require('./routes/user.route.js');
const cookieParser = require("cookie-parser");


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api", quizRoutes);
app.use("/api", authRoutes);
app.use('/user',userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, message });
  next();
});
