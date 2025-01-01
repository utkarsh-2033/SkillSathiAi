import React from 'react';

const MCQQuestion = ({ questionIndex, question, selectedAnswer, onAnswerChange }) => {
  return (
    <div className="mb-6 p-4 border-2 border-gray-300 rounded-lg shadow-sm">
      <p className="font-semibold text-lg my-3">{question.question}</p>
      {question.options.map((option, index) => (
        <div key={index} className="flex items-center space-x-3 mb-3">
          <input
            type="radio"
            id={`${questionIndex}-${index}`}
            name={`question-${questionIndex}`}
            value={option}
            checked={selectedAnswer === option}
            onChange={() => onAnswerChange(questionIndex, option)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor={`${questionIndex}-${index}`}
            className={`text-lg ${selectedAnswer === option ? 'font-semibold text-blue-600' : ''}`}
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default MCQQuestion;
