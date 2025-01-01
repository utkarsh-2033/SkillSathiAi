import React from 'react';

const SubjectiveQuestion = ({ questionIndex, question, onAnswerChange }) => {
  return (
    <div className="mb-6 p-4 border-2 border-gray-300 rounded-lg shadow-sm">
      <p className="font-semibold text-lg my-3">{question.question}</p>
      <textarea
        placeholder="Write your answer here..."
        rows={5}
        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out resize-none"
        value={question.answer || ''}
        onChange={(e) => onAnswerChange(questionIndex, e.target.value)}
      />
    </div>
  );
};

export default SubjectiveQuestion;
