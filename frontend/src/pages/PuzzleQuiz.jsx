import React, { useState, useEffect } from 'react';
import "./PuzzleQuiz.css";
import Timer from "../componenets/Games/Timer.jsx";
import Dropdownbar from "../componenets/Games/Dropdown.jsx"
import GameResult from "../componenets/Games/GameResult.jsx";
function generateWordSearch(gridSize, wordList) {
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  const directions = [
    { dx: 0, dy: 1 },
    { dx: 1, dy: 0 },
  ];


  const isValidPosition = (x, y, word, direction) => {
    const endX = x + direction.dx * (word.length - 1);
    const endY = y + direction.dy * (word.length - 1);
    if (endX < 0 || endY < 0 || endX >= gridSize || endY >= gridSize) return false;


    for (let i = 0; i < word.length; i++) {
      const nx = x + direction.dx * i;
      const ny = y + direction.dy * i;
      if (grid[nx][ny] !== null && grid[nx][ny] !== word[i]) return false;
    }
    return true;
  };


  const placeWord = (word) => {
    const upperWord = word.toUpperCase();
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      const direction = directions[Math.floor(Math.random() * directions.length)];
      if (isValidPosition(x, y, upperWord, direction)) {
        for (let i = 0; i < upperWord.length; i++) {
          grid[x + direction.dx * i][y + direction.dy * i] = upperWord[i];
        }
        placed = true;
      }
    }
  };


  wordList.forEach(word => placeWord(word));
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === null) {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }


  return grid;
}


const PuzzleQuiz = () => {
  const gridSize = 10;
  const wordList = ["hypertext", "react", "mysql", "git", "python"];
  const wordQuestions = {
    hypertext: "What does H in HTML stand for?",
    react: "Which of the following is a JavaScript framework?",
    mysql: "What is used for creating databases in web development?",
    git: "Which tool is used for version control in web development?",
    python: "Which programming language is primarily used for backend web development?",
  };


  const [grid, setGrid] = useState(() => generateWordSearch(gridSize, wordList));
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [hints, setHints] = useState(wordQuestions);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);


  const handleCellSelect = (row, col) => {
    if (isTimeUp) return;


    const newSelectedCells = [...selectedCells, { row, col }];
    if (newSelectedCells.length > 1) {
      const [start, end] = [newSelectedCells[0], newSelectedCells[newSelectedCells.length - 1]];
      const isSameRow = start.row === end.row;
      const isSameColumn = start.col === end.col;
      if (!isSameRow && !isSameColumn) return;
    }


    setSelectedCells(newSelectedCells);
    const word = newSelectedCells.map(({ row, col }) => grid[row][col]).join('');
    if (wordList.includes(word.toLowerCase()) && !foundWords.includes(word.toLowerCase())) {
      setFoundWords([...foundWords, word.toLowerCase()]);
      setSelectedCells([]);
      if (foundWords.length + 1 === wordList.length) {
        clearInterval(timerInterval);
        setIsTimeUp(true);
        setShowResult(true);
        setTimeout(() => {
          setShowResult(false);
        }, 3000); // Hide result after 3 seconds
      }
    }
  };


  const resetPuzzle = () => {
    setGrid(generateWordSearch(gridSize, wordList));
    setSelectedCells([]);
    setFoundWords([]);
    setIsTimeUp(false);
    setShowResult(false);
    setTimeLeft(60);
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    const newTimerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(newTimerInterval);
          onTimeUp();
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(newTimerInterval);
  };


  const onTimeUp = () => {
    setIsTimeUp(true);
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
    }, 10000);


  };


  useEffect(() => {
    const newTimerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(newTimerInterval);
          onTimeUp();
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(newTimerInterval);


    return () => clearInterval(newTimerInterval);
  }, []);


  return (
    <div className="game-app">
  <h1 className="game-heading">Word Search Puzzle</h1>
  <Dropdownbar />
  <span className="game-shine">
    <button className="game-reset" onClick={resetPuzzle} style={{ marginTop: '20px' }}>Reset Puzzle</button>
    <Timer key={timeLeft} timeLeft={timeLeft} onTimeUp={onTimeUp} />
  </span>
  <div className="game-hints-and-grid">
    <div className="game-hints">
      <h3>Hints:</h3>
      <ul>
        {Object.entries(hints).map(([word, hint]) => (
          <p key={word}>{hint}</p>
        ))}
      </ul>
    </div>
    <div className="game-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 40px)` }}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="game-cell"
            style={{
              width: '40px',
              height: '40px',
              border: '2px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px',
              backgroundColor: selectedCells.some(({ row, col }) => row === rowIndex && col === colIndex) ? '#d3d3d3' : 'transparent',
              color: highlightedCells.has(`${rowIndex}-${colIndex}`) ? 'green' : 'black',
            }}
            onClick={() => handleCellSelect(rowIndex, colIndex)}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  </div>
  <div className="game-found-words">
    <h3>Words Found:</h3>
    <ul>
      {foundWords.map((word, index) => (
        <li key={index}>{word}</li>
      ))}
    </ul>
  </div>
  {showResult && isTimeUp && (
    <GameResult isWin={foundWords.length === wordList.length} resetPuzzle={resetPuzzle} />
  )}
</div>


  );
};


export default PuzzleQuiz;
