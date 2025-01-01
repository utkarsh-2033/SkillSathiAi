import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MCQQuestion from "../componenets/Questionformat/MCQQuestion";
import SubjectiveQuestion from "../componenets/Questionformat/SubjectiveQuestion";
import ProgressBar from "../componenets/Quiz/ProgressBar";
import FormatTimer from "../componenets/Quiz/FormatTimer";
import QuestionNavigation from "../componenets/Quiz/QustionNavigation";

const Quiz = () => {
  const { skillname } = useParams();
  const location = useLocation(); // For fetching query parameters
  const navigate = useNavigate(); // For navigation
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimerStopped, setIsTimerStopped] = useState(false);

  // Fetch the level from the query string (default to "easy")
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get("level") || "easy";

  // Fetch questions based on skillname and level
  useEffect(() => {
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `/api/quiz/questions?title=${skillname}&level=${level}`
        );
        const data = await response.json();
        console.log(data);
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [skillname, level]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    setIsCompleted(true);
    setIsTimerStopped(true);
  };

  const handleQuizLevel = () => {
    if (level === "easy") {
      navigate(`/quiz/${skillname}?level=intermediate`);
    } else {
      navigate(`/quiz/${skillname}?level=advanced`);
    }
  };
  

  const calculateTimeTaken = () => {
    return ((Date.now() - quizStartTime) / 1000).toFixed(2); // Time in seconds
  };

  const calculateScore = () => {
    return Object.values(answers).filter(
      (answer, index) => answer === questions[index].correct_option
    ).length;
  };
  // Check if questions are loaded
  if (questions.length === 0) {
    return <div className="text-center">Loading questions...</div>; // Show loading message if questions are not yet loaded
  }

  return (
    <div className="bg-gray-100 w-4/5 mx-auto mt-6 p-6 rounded-lg shadow-lg  max-w-4xl">
      <h2 className="text-3xl font-bold mb-4 text-center">
        Quiz: {skillname}- <span className="text-green-800">{level}</span>
      </h2>
      {/* <FormatTimer quizStartTime={quizStartTime} /> */}
      {!isCompleted && (
        <FormatTimer
          quizStartTime={quizStartTime}
          isTimerStopped={isTimerStopped}
        />
      )}

      <ProgressBar
        current={currentQuestionIndex + 1}
        total={questions.length}
      />
      {!isCompleted && (
        <QuestionNavigation
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onJumpToQuestion={handleJumpToQuestion}
        />
      )}

      {isCompleted ? (
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 text-white rounded-lg shadow-lg p-8 max-w-lg mx-auto mt-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold mb-4">Quiz Completed!</h3>
            <p className="text-lg mb-2">
              Total Score:{" "}
              <span className="text-yellow-300">
                {calculateScore()} / {questions.length}
              </span>
            </p>
            <p className="text-lg mb-4">
              Total Time:{" "}
              <span className="text-yellow-300">
                {calculateTimeTaken()} seconds
              </span>
            </p>
            {level !== "advanced" && (
              <button
                onClick={handleQuizLevel}
                className="px-8 my-2 py-3 bg-green-600 text-gray-800 rounded-full shadow-md hover:bg-green-400 transition duration-300 ease-in-out transform hover:scale-105"
              >
                {level === "easy"
                  ? "Go to Intermediate level"
                  : "Go to Advance level"}
              </button>
            )}
            <button
              onClick={() => navigate("/skill-assessment")}
              className="px-8 py-3 bg-yellow-400 text-gray-800 rounded-full shadow-md hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Go Back to Skill Assessment
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            {/* <h3 className="font-semibold mb-2 mt-5">
              {questions[currentQuestionIndex].question}
            </h3> */}
            {questions[currentQuestionIndex].type === "MCQ" ? (
              <MCQQuestion
                questionIndex={currentQuestionIndex}
                question={questions[currentQuestionIndex]}
                selectedAnswer={answers[currentQuestionIndex]}
                onAnswerChange={handleAnswerChange}
              />
            ) : (
              <SubjectiveQuestion
                questionIndex={currentQuestionIndex}
                question={questions[currentQuestionIndex]}
                onAnswerChange={handleAnswerChange}
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
              }
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
