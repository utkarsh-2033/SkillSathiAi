import React, { useEffect, useState } from "react";
import axios from "axios";

const GameResult = ({ isWin, resetPuzzle, userId }) => {
  const coinsWon = 5; // Set reward coins here
  const [rewardAdded, setRewardAdded] = useState(false); // Track if the reward is already added

  useEffect(() => {
    if (isWin && !rewardAdded) {
      const addReward = async () => {
        try {
          await axios.post("/user/add", { userId, coinsWon });
          alert(`Congratulations! You've won ${coinsWon} coins!`);
          setRewardAdded(true); // Set flag to true after adding the reward
        } catch (error) {
          console.error("Error adding reward:", error);
        }
      };

      addReward();
    }
  }, [isWin, rewardAdded, userId]);

  return (
    <div className="game-result" style={{ textAlign: "center", marginTop: "20px" }}>
      {isWin ? (
        <>
          <h2>🎉 You Win! 🎉</h2>
          <p>Congratulations on finding all the words!</p>
          <button
            onClick={() => {
              setRewardAdded(false); // Reset the reward state for a new game
              resetPuzzle(); // Reset the game
            }}
          >
            Play Again
          </button>
        </>
      ) : (
        <>
          <h2>😞 You Lose! 😞</h2>
          <p style={{ margin: "20px" }}>Better luck next time!</p>
          <button onClick={resetPuzzle}>Try Again</button>
        </>
      )}
    </div>
  );
};

export default GameResult;
