import React from 'react';
import styles from '../../pages/sudokustyle.module.css';

const FloatingBalls = () => {
  return (
    <div className="background">
    <div className={styles.balls}>
      <div className={styles.ball}></div>
      <div className={styles.ball}></div>
      <div className={styles.ball}></div>
      <div className={styles.ball}></div>
      <div className={styles.ball}></div>
    </div></div>
  );
};

export default FloatingBalls;
