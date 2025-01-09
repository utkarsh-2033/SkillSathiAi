const Question = require("../models/gkquiz.model.js");

// Get a question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findOne({ question_id: id });
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Determine the career goal
const determineCareerGoal = async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected options
    const careerGoals = {};

    answers.forEach((answer) => {
      answer.careerGoals.forEach((goal) => {
        careerGoals[goal] = (careerGoals[goal] || 0) + 1;
      });
    });

    const sortedGoals = Object.entries(careerGoals).sort((a, b) => b[1] - a[1]);
    const topGoals = sortedGoals.slice(0, 3).map((goal) => goal[0]);

    res.status(200).json({ topGoals });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getQuestionById, determineCareerGoal };
