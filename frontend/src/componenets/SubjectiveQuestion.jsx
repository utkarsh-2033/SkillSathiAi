// src/components/SubjectiveQuestion.js
import React, { useState } from 'react';

const SubjectiveQuestion = ({ question, index }) => {
  const [answer, setAnswer] = useState('');

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">{question.questionText}</h3>
      <textarea
        value={answer}
        onChange={handleAnswerChange}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
        placeholder="Write your answer here..."
      />
    </div>
  );
};

export default SubjectiveQuestion;
