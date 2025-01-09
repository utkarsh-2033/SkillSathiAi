const express = require("express");
const router = express.Router();
const {
  getQuizBySkillAndLevel,
  saveQuiz,
  subjectiveAnsmatch,
} = require("../controllers/quiz.controller");

// Route to get questions by title and level
router.get("/quiz/questions", getQuizBySkillAndLevel);

// Route to add a question to an existing quiz
router.post("/addQuestion", saveQuiz);

router.post("/semantic-similarity", subjectiveAnsmatch);

module.exports = router;
