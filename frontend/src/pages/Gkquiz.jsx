import React, { useState, useEffect } from 'react';


function GkQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [careerSuggestions, setCareerSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/gkquiz/questions');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
      }
    };


    fetchQuestions();
  }, []);


  const handleOptionClick = (optionIndex) => {
    setSelectedOptionIndex(optionIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const answer = {
      questionId: currentQuestion._id,
      selectedOptionIndex: optionIndex,
    };


    setSelectedAnswers([...selectedAnswers, answer]);


    setTimeout(() => {
      if (currentQuestion.options[optionIndex].nextQuestion !== undefined) {
        setCurrentQuestionIndex(currentQuestion.options[optionIndex].nextQuestion);
        setSelectedOptionIndex(null);
      } else {
        submitAnswers();
      }
    }, 500);
  };


  const submitAnswers = async () => {
    try {
      const response = await fetch('http://localhost:5000/gkquiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers }),
      });


      const data = await response.json();
      setCareerSuggestions(data.suggestedCareerGoals);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };


  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setCareerSuggestions([]);
    setSelectedOptionIndex(null);
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading questions...</div>;
  }


  if (careerSuggestions.length > 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-white p-10 rounded-lg shadow-xl max-w-4xl w-4/5">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Career Goals Tailored for You</h1>
          <ul className="space-y-4">
            {careerSuggestions.map((goal, index) => (
              <li key={index} className="text-lg text-gray-700">{goal}</li>
            ))}
          </ul>
          <button
            onClick={restartQuiz}
            className="w-full mt-6 py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }


  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-screen text-lg">No questions available.</div>;
  }


  const currentQuestion = questions[currentQuestionIndex];


  return (
    <>
      <h1 className="text-center text-5xl font-extrabold text-indigo-800 mt-20 mb-10">Your Path to the Perfect Career Starts Here!</h1>
      <div className="flex justify-center items-center mt-5">
        <div className="bg-white p-12 rounded-lg shadow-xl max-w-4xl w-4/5">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {`${currentQuestionIndex + 1}. ${currentQuestion.question}`}
          </h2>
          <ul className="space-y-6">
            {currentQuestion.options.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleOptionClick(index)}
                  className={`w-full py-4 px-8 text-white font-bold text-xl rounded-md transition duration-300 ease-in-out transform ${
                    selectedOptionIndex === index
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {option.answer}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}


export default GkQuiz;
