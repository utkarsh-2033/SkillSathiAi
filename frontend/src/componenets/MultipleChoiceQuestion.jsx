// src/components/MultipleChoiceQuestion.js
import React, { useState } from 'react';

const MultipleChoiceQuestion = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">{question.questionText}</h3>
      <ul className="space-y-2">
        {question.options.map((option, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`option-${idx}`}
              name={`question-${index}`}
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
              className="form-radio text-blue-500"
            />
            <label htmlFor={`option-${idx}`} className="text-gray-700">
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultipleChoiceQuestion;
