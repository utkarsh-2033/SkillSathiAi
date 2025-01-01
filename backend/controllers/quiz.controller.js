const Quiz = require('../models/quiz.model');

const getQuizBySkillAndLevel = async (req, res) => {
  try {
    const { title } = req.query;
    const level = req.query.level.trim(); 


    if (!title || !level) {
      return res.status(400).json({ error: 'Title and level are required.' });
    }

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

    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};



module.exports = {
  getQuizBySkillAndLevel,
  
};
