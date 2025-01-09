const express=require('express')
const { getQuestionById, determineCareerGoal } = require("../controllers/gkquiz.controller.js");


const router = express.Router();


router.get("/:id", getQuestionById); // Get a question by ID
router.post("/career-goal", determineCareerGoal); // Determine career goal


module.exports = router;
