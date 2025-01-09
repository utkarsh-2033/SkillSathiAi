const Quiz = require('../models/gkquiz.model.js');  // Assuming the Quiz model is in the models directory


// Get all quiz questions
const getQuizQuestions = async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Fetching all quiz questions
  //  console.log(quizzes);
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Handle the submission of quiz answers and return suggested career goals
const submitQuizAnswers = async (req, res) => {
  const { answers } = req.body; // Array of selected answers, with each answer containing questionId and selectedOptionIndex
//  console.log(answers);
  let careerGoals = [];


  try {
    // Iterate over the user's answers to compute the career goals
    for (let answer of answers) {
      const question = await Quiz.findById(answer.questionId); // Fetch the question by ID
      if (!question) {
        return res.status(400).json({ error: 'Question not found' });
      }


      const option = question.options[answer.selectedOptionIndex];
      if (option) {
        careerGoals = [...careerGoals, ...option.careerGoals]; // Add the selected option's career goals
      }
    }


    // Remove duplicates from the career goals array
    careerGoals = [...new Set(careerGoals)];


    res.status(200).json({ suggestedCareerGoals: careerGoals }); // Return the unique career goals
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getQuizQuestions,
  submitQuizAnswers,
};
