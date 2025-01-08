import React from "react";
import { useNavigate } from "react-router-dom";

const QuizResult = ({
  score,
  totalQuestions,
  totalTime,
  level,
  onNextLevel,
  skillname,
  from,
}) => {
  const navigate = useNavigate();
  const navigatehandler = () => {
    if (from === "SkillQuiz") {
      navigate("/skillQuiz");
    } else {
      navigate("/skill-assessment");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 text-white rounded-lg shadow-lg p-8 max-w-lg mx-auto mt-8">
      <div className="text-center">
        <h3 className="text-3xl font-extrabold mb-4">Quiz Completed!</h3>
        <p className="text-lg mb-2">
          Total Score:{" "}
          <span className="text-yellow-300">
            {score} / {totalQuestions}
          </span>
        </p>
        <p className="text-lg mb-4">
          Total Time:{" "}
          <span className="text-yellow-300">{totalTime} seconds</span>
        </p>
        {level !== "advanced" && (
          <button
            onClick={onNextLevel}
            className="px-8 my-2 py-3 bg-green-600 text-gray-800 rounded-full shadow-md hover:bg-green-400 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {level === "easy"
              ? "Go to Intermediate Level"
              : "Go to Advanced Level"}
          </button>
        )}
        <button
          onClick={navigatehandler}
          className="px-8 py-3 bg-yellow-400 text-gray-800 rounded-full shadow-md hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105"
        >
          {from !== "SkillQuiz"
            ? "Go Back to Skill Assessment"
            : "Go Back to Skills Quiz"}
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
