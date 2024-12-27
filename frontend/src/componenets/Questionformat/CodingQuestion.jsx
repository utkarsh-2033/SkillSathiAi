// src/components/CodingQuestion.js
import React, { useState } from 'react';

const CodingQuestion = ({ question, index }) => {
  const [code, setCode] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">{question.questionText}</h3>
      <textarea
        value={code}
        onChange={handleCodeChange}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="6"
        placeholder="Write your code here..."
      />
    </div>
  );
};

export default CodingQuestion;
