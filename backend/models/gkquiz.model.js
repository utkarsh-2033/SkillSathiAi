const mongoose = require("mongoose");


const QuestionSchema = new mongoose.Schema({
  question_id: { type: Number, required: true },
  question_text: { type: String, required: true },
  options: [
    {
      answer: { type: String, required: true },
      careerGoals: [String],
      nextQuestion: { type: Number, default: null },
    },
  ],
});


module.exports = mongoose.model("Question", QuestionSchema);
