import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MCQQuestion from "../componenets/Questionformat/MCQQuestion";
import SubjectiveQuestion from "../componenets/Questionformat/SubjectiveQuestion";
import ProgressBar from "../componenets/Quiz/ProgressBar";
import FormatTimer from "../componenets/Quiz/FormatTimer";
import QuestionNavigation from "../componenets/Quiz/QustionNavigation";
import QuizResult from "../componenets/Quiz/QuizResult";
import { selectUser } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";

const Quiz = () => {
  const { skillname } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [correctAns, setCorrectAns] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimerStopped, setIsTimerStopped] = useState(false);
  const [difficultyAverage, setDifficultyAverage] = useState(0);

  const user = useSelector(selectUser);
  // Function to calculate average difficulty
  useEffect(() => {
    if (questions && questions.length > 0) {
      const totalDifficulty = questions.reduce(
        (sum, question) => sum + question.difficulty_index,
        0
      );
      const avgDifficulty = totalDifficulty / questions.length;
      setDifficultyAverage(avgDifficulty.toFixed(2)); // Rounded to 2 decimal places
    }
  }, [questions]);
  // console.log(difficultyAverage);

  // Fetching the level from the query string (default to "easy")
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get("level") || "easy";

  // Fetch questions based on skillname and level
  useEffect(() => {
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/quiz/questions?title=${skillname}&level=${level}`
        );
        const data = await response.json();
        // console.log(data);
        setQuestions(data.questions);

        // Extract correct options into an object
        const correctOptions = {};
        data.questions.forEach((question, index) => {
          correctOptions[index] = question.correct_option;
        });
        setCorrectAns(correctOptions);
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

  const handleSubmit = async () => {
    console.log(correctAns);
    console.log(answers);
    setIsCompleted(true);
    setIsTimerStopped(true);
    const resultData = {
      userId: user._id,
      skillName: skillname,
      level,
      score: calculateScore(),
      timeTaken: calculateTimeTaken(),
      avgDifficulty: difficultyAverage,
      isPassed: calculateScore() > 7,
    };
    // console.log(resultData);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/saveQuizResult/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultData),
      });
      const data = await res.json();
      if (res.ok) {
        // console.log(data);
      } else {
        console.log("error in saving result");
      }
    } catch (error) {
      console.log(error);
    }
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
    console.log("Answers:", answers);
    console.log("Correct Answers:", correctAns);
    const correctCount = Object.keys(answers).filter((key) => {
      return answers[key] === correctAns[key];
    }).length;
    console.log("Correct Count:", correctCount);
    return correctCount;
  };
  // Check if questions are loaded
  if (questions.length === 0) {
    return <div className="text-center">Loading questions...</div>; // Show loading message if questions are not yet loaded
  }

  return (
    <div  className="bg-gray-100 w-4/5 mx-auto min-h-screen mb-12 mt-6 p-6 rounded-lg shadow-lg  max-w-4xl">
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
        <QuizResult
          score={calculateScore()}
          totalQuestions={questions.length}
          totalTime={calculateTimeTaken()}
          level={level}
          onNextLevel={handleQuizLevel}
          skillname={skillname}
          from={location.state?.from}
        />
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
                selectedAnswer={answers[currentQuestionIndex]}
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