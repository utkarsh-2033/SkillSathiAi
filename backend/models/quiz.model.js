// models/Quiz.js (Example)
const mongoose = require('mongoose');

// Schema for a Quiz question
const quizSchema = new mongoose.Schema({
  careerGoal: { type: String, required: true }, // Career goal like "Web Developer", "Data Scientist"
  skill: { type: String, required: true }, // Skill related to the quiz like "JavaScript", "DSA"
  level: { type: String, required: true }, // Level: Beginner, Intermediate, Advanced
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
      type: { type: String, enum: ['multiple-choice', 'coding', 'subjective'], required: true },
      explanation: { type: String, default: '' },
    }
  ],
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
