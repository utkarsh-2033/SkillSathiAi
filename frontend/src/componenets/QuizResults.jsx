// src/components/QuizResults.js
import React from 'react';

const QuizResults = ({ results }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>
      <div className="space-y-4">
        <p className="text-lg">Total Questions: {results.total}</p>
        <p className="text-lg">Correct Answers: {results.correct}</p>
        <p className="text-lg">Incorrect Answers: {results.incorrect}</p>
        <div>
          <h3 className="font-medium">Answers Breakdown:</h3>
          <ul className="space-y-2">
            {results.breakdown.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-gray-700">{item.question}</span>
                <span className={item.correct ? 'text-green-500' : 'text-red-500'}>
                  {item.correct ? 'Correct' : 'Incorrect'}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
