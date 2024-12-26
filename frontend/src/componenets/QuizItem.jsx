// src/components/QuizItem.js
import React from 'react';

const QuizItem = ({ question, index }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">{question.questionText}</h3>
      {question.type === 'multiple-choice' && (
        <ul className="space-y-2">
          {question.options.map((option, idx) => (
            <li key={idx} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`option-${idx}`}
                name={`question-${index}`}
                className="form-radio text-blue-500"
              />
              <label htmlFor={`option-${idx}`} className="text-gray-700">
                {option}
              </label>
            </li>
          ))}
        </ul>
      )}
      {/* Add other types of questions here */}
    </div>
  );
};

export default QuizItem;
