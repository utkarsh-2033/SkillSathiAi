import React from 'react';

const QuestionNavigation = ({ questions, currentQuestionIndex, onJumpToQuestion }) => {
  return (
    <div className="flex flex-wrap justify-center my-3 mb-4">
      {questions.map((_, index) => (
        <button
          key={index}
          onClick={() => onJumpToQuestion(index)}
          className={`w-8 h-8 m-1 text-sm font-semibold rounded-full ${
            index === currentQuestionIndex ? 'bg-blue-600 text-white' : 'bg-gray-300'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default QuestionNavigation;
