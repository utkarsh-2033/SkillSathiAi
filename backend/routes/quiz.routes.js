const express = require('express');
const router = express.Router();
const {getQuizBySkillAndLevel,saveQuiz}=require('../controllers/quiz.controller')

// Route to get questions by title and level
router.get('/quiz/questions', getQuizBySkillAndLevel);

// Route to add a question to an existing quiz
router.post("/addQuestion", saveQuiz );


module.exports = router;
