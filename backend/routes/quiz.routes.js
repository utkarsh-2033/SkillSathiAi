const express = require('express');
const router = express.Router();
const {getQuizBySkillAndLevel}=require('../controllers/quiz.controller')

// Route to get questions by title and level
router.get('/quiz/questions', getQuizBySkillAndLevel);

module.exports = router;
