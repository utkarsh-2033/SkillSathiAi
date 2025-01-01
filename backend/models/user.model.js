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
  careerDetails: {
    careerGoal: {
      type: String,
    },
    level: {
      type: String,
    },
    subLevel: {
      type: String,
    },
    skills: [
      {
        skillName: { type: String, required: true },
        known: { type: Boolean, required: true },
        level: {
          type: String,
          enum: ["nill", "Beginner", "Intermediate", "Advanced"],
          required: false,
        },
      },
    ],
  },
});
module.exports = mongoose.model("User", userSchema);
