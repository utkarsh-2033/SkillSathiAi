import React from 'react';

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full bg-gray-300 rounded-full my-4 h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-xs text-gray-600 text-center mt-1">
        Question {current} of {total}
      </p>
    </div>
  );
};

export default ProgressBar;
