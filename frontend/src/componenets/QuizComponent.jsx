// src/components/QuizComponent.js
import React, { useState, useEffect } from 'react';
import LoadingComponent from './Loading';
import QuizResults from './QuizResults';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import SubjectiveQuestion from './SubjectiveQuestion';
import CodingQuestion from './CodingQuestion';

const QuizComponent = ({ careerGoal }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`/api/quiz/${careerGoal}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }
        const data = await response.json();
        console.log(data);
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [careerGoal]);

  const handleAnswerChange = (index, answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    setQuizCompleted(true);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (quizCompleted) {
    const results = calculateResults();
    return <QuizResults results={results} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-center">
        Quiz for {careerGoal}
      </h1>
      <div className="space-y-4">
        {questions.map((question, index) => {
          if (question.type === 'multiple-choice') {
            return (
              <MultipleChoiceQuestion
                key={index}
                question={question}
                index={index}
                onAnswerChange={handleAnswerChange}
              />
            );
          } else if (question.type === 'subjective') {
            return (
              <SubjectiveQuestion
                key={index}
                question={question}
                index={index}
                onAnswerChange={handleAnswerChange}
              />
            );
          } else if (question.type === 'coding') {
            return (
              <CodingQuestion
                key={index}
                question={question}
                index={index}
                onAnswerChange={handleAnswerChange}
              />
            );
          }
        })}
      </div>
      <div className="mt-6 text-center">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

const calculateResults = () => {
  // This function will calculate the results based on the user's answers.
  // Here, you can implement logic to compare userAnswers with correct answers.

  const results = {
    total: 5, // Assume 5 questions for now
    correct: 3, // Replace with the actual count based on answers
    incorrect: 2, // Replace with the actual count based on answers
    breakdown: [
      { question: 'Question 1', correct: true },
      { question: 'Question 2', correct: false },
      { question: 'Question 3', correct: true },
      { question: 'Question 4', correct: false },
      { question: 'Question 5', correct: true },
    ],
  };

  return results;
};

export default QuizComponent;
