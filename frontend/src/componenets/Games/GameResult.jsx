import React from "react";


const GameResult = ({isWin, resetPuzzle}) => {
  return (
    <div className="game-result" style={{ textAlign: "center", marginTop: "20px" }}>
      {isWin ? (
        <>
          <h2>🎉 You Win! 🎉</h2>
          <p>Congratulations on finding all the words!</p>
        </>
      ) : (
        <>
          <h2>😞 You Lose! 😞</h2>
          <p>Better luck next time!</p>
        </>
      )}
     
    </div>
  );
};


export default GameResult;
