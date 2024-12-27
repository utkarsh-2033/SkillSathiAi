const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
  },
  careerGoal: { type: String, required: true },
  skills: [String], // List of skills the user knows
  progress: {
    quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  },
});

module.exports = mongoose.model("User", userSchema);
