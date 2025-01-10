import React, { useEffect, useState } from 'react';
import styles from '../../pages/puzzleword.module.css';

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
    <div >
      <p className={styles.timer}>Time Left: {time} seconds</p>
    </div>
  );
};

export default Timer;
