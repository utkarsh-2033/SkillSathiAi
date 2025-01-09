const mongoose = require('mongoose');


const optionSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  careerGoals: { type: [String], required: true },
  nextQuestion: { type: Number, required: true },  // This field is used to navigate to the next question
});


const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [optionSchema], required: true },
});


const gkQuiz = mongoose.model('gkQuiz', quizSchema);


module.exports = gkQuiz;
