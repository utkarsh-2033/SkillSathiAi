const express = require('express');
const { getQuizByCareerGoal, submitQuizResults } = require('../controllers/quiz.controller');

const router = express.Router();

// Route to get quiz based on career goal
router.get('/quiz/:careerGoal', getQuizByCareerGoal);

// Route to submit quiz results
router.post('/submitQuizResults', submitQuizResults);

module.exports = router;
