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
  progress: [
    {
      skillName: { type: String, required: true },
      level: { type: String, required: true },
      testScore: { type: Number, required: true },
      timeTaken: { type: Number, required: true }, // in seconds
      avgDifficulty:{type:Number,required:true},
      dateTimeGiven: { type: Date, default: Date.now },
      isPassed: { type: Boolean, required: true },
    },
    
  ],
  skillProficiencyAssessment: {
    type: [
      {
        input_data: {
          difficulty_avg: [Number],
          level: [String],
          score: [Number],
          skill_name: [String],
          time_taken_avg: [Number],
        },
        predictions: [Number],
        feedback: [String],
        dateTimeGiven: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  rewards: {
    coins: {
      type: Number,
      default: 0, // Default coins are 0 for new users
    },
  },


});
module.exports = mongoose.model("User", userSchema);
