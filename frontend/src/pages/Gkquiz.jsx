import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Question = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // Add state to track selected option
  const [careerGoals, setCareerGoals] = useState(null);
  const navigate=useNavigate();

  const fetchQuestion = async (questionId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/questions/${questionId}`
      );
      setCurrentQuestion(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestion(1); // Start with the first question
  }, []);

  const handleAnswer = (option) => {
    setAnswers([...answers, option]);
    setSelectedOption(option); // Set selected option

    if (option.nextQuestion) {
      fetchQuestion(option.nextQuestion);
    } else {
      determineCareerGoal();
    }
  };

  const determineCareerGoal = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/questions/career-goal",
        { answers }
      );
      setCareerGoals(res.data.topGoals);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(null);
    setAnswers([]);
    setCareerGoals(null);
    setSelectedOption(null); // Reset selected option
    fetchQuestion(1); // Restart the quiz from the first question
  };

  const handleNavigate=()=>{
    navigate("/career-goal")
  }

  if (careerGoals) {
    return (
      <div className="my-24 flex justify-center items-center">
        <div className="bg-gradient-to-r  from-indigo-500 via-purple-500 to-pink-500 p-12 rounded-lg shadow-2xl max-w-4xl w-4/5">
          <h1 className="text-4xl font-bold text-center text-white mb-6">
            Your Personalized Career Suggestions
          </h1>
          <ul className="space-y-4">
            {careerGoals.map((goal, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-md shadow-md text-center text-gray-800 text-lg font-medium"
              >
                {goal}
              </li>
            ))}
          </ul>
          <div classname='flex flex-col gap-5'>
            <button
              onClick={handleNavigate}
              className="w-full mt-6 py-3 px-6 bg-blue-600 text-white text-xl font-semibold rounded-md hover:bg-blue-800 transition duration-300"
            >
              Decided Career Goal? Start from here.
            </button>
            <button
              onClick={handleRestart}
              className="w-full mt-6 py-3 px-6 bg-green-600 text-white text-xl font-semibold rounded-md hover:bg-green-700 transition duration-300"
            >
              Still not sure? Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center text-5xl font-extrabold text-indigo-800 mt-20 mb-10">
        Your Path to the Perfect Career Starts Here!
      </h1>
      <div className="flex justify-center items-center mt-5">
        <div className="bg-white p-12 rounded-lg shadow-xl max-w-4xl w-4/5">
          {currentQuestion && (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                {currentQuestion.question_text}
              </h2>
              <ul className="space-y-6">
                {currentQuestion.options.map((option, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleAnswer(option)}
                      className={` w-full font-bold text-xl rounded-md text-white ition duration-300 ease-in-out transform px-8 py-4  ${
                        selectedOption === option
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-green-700"
                      }`}
                    >
                      {option.answer}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Question;
