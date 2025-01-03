import React, { useEffect, useState } from 'react';


const Timer = ({ timeLeft, onTimeUp }) => {
  const [time, setTime] = useState(timeLeft);


  useEffect(() => {
    setTime(timeLeft);
  }, [timeLeft]);


  useEffect(() => {
    if (time === 0) {
      onTimeUp();
      return;
    }


    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);


    return () => clearInterval(timer);
  }, [time, onTimeUp]);


  return (
    <div className="timer">
      <p>Time Left: {time}s</p>
    </div>
  );
};


export default Timer;
