

//  const getQuizcontroller=async (req, res) => {
//   const { careerGoal, skill, difficulty } = req.query;

//   try {
//     const questions = await Quiz.find({
//       careerGoal,
//       skill,
//       difficulty,
//     });
//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch quiz', error });
//   }
// }


//  const postquizcontroller=async (req, res) => {
//   const { userId, quizId, answers } = req.body;

//   try {
//     const quiz = await Quiz.findById(quizId);
//     let score = 0;

//     answers.forEach((answer, index) => {
//       if (answer === quiz.correctOption) {
//         score++;
//       }
//     });

//     // Update user progress
//     const user = await User.findById(userId);
//     user.progress.quizzesTaken.push(quizId);
//     await user.save();

//     res.json({ score, totalQuestions: quiz.options.length });
//   } catch (error) {
//     res.status(500).json({ message: 'Error processing quiz submission', error });
//   }
// }

// controllers/quiz.controller.js

const Quiz = require('../models/quiz.model');

const getQuizByCareerGoal = async (req, res) => {
  try {
    const { careerGoal } = req.params;
    const quiz = await Quiz.findOne({ careerGoal });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found for this career goal' });
    }

    return res.json(quiz);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching quiz data', error });
  }
};

const submitQuizResults = async (req, res) => {
  try {
    const { userId, quizResponses } = req.body; // `quizResponses` is an array of user's answers
    
    // Fetch the quiz questions from the database
    const quiz = await Quiz.findOne({ careerGoal: quizResponses.careerGoal });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Evaluate the quiz answers
    let score = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = quizResponses.answers[index];
      if (userAnswer === question.correctAnswer) {
        score++;
      }
    });

    // Store the user's result (you can save it in a results collection or user model)
    // For now, just returning the score
    return res.json({ score, totalQuestions: quiz.questions.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error submitting quiz results', error });
  }
};

module.exports = {
  getQuizByCareerGoal,
  submitQuizResults,
};


// module.exports = { getQuizcontroller , postquizcontroller };