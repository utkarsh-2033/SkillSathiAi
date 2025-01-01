const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: false },
  correct_option: { type: String, required: false },
  difficulty_index: { type: Number, required: true },
  explanation: { type: String, required: true },
});

const LevelSchema = new mongoose.Schema({
  easy: [QuestionSchema],
  intermediate: [QuestionSchema],
  advanced: [QuestionSchema],
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  levels: LevelSchema,
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
