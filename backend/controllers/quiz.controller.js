const Quiz = require('../models/quiz.model');

const getQuizBySkillAndLevel = async (req, res) => {
  try {
    let { title } = req.query;
    const level = req.query.level.trim(); 


    if (!title || !level) {
      return res.status(400).json({ error: 'Title and level are required.' });
    }
    // tiltle=title.toUpperCase();
    // console.log(title);
    // Find the quiz by title
    const quiz = await Quiz.findOne({ title });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    // Fetch questions based on the level
    // console.log(quiz.levels["easy"]);
    const questions = quiz.levels[level];

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for the specified level.' });
    }
    // console.log(questions)
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Save a new quiz
const saveQuiz = async (req, res) => {
  let { title, level, question } = req.body;

  if (!title || !level || !question) {
    return res.status(400).json({ error: "Missing required fields: title, level, or question." });
  }

  try {
    const quiz = await Quiz.findOne({ title: title.toUpperCase() });
    // title=title.toUpperCase();
    // console.log(title);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    if (!quiz.levels[level]) {
      return res.status(400).json({ error: `Level '${level}' does not exist in the quiz.` });
    }

    quiz.levels[level].push(question);

    await quiz.save();

    res.status(200).json({ message: "Question added successfully." });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}




module.exports = {
  getQuizBySkillAndLevel,
  saveQuiz
  
};
