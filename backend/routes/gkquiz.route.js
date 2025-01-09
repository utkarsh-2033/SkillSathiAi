const express = require('express');
const router = express.Router();
const {getQuizQuestions,submitQuizAnswers}=require("../controllers/gkquiz.controller.js");

router.get('/questions', getQuizQuestions);

router.post('/submit', submitQuizAnswers);

module.exports = router;