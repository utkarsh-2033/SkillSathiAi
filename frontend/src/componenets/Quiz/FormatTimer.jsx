import React, { useState, useEffect } from 'react';

const Timer = ({ quizStartTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(((Date.now() - quizStartTime) / 1000).toFixed(0));
    }, 1000);

    return () => clearInterval(interval);
  }, [quizStartTime]);

  return (
    <div className="text-right text-sm my-3 text-gray-600">
      Time Elapsed: {elapsedTime} seconds
    </div>
  );
};

export default Timer;
