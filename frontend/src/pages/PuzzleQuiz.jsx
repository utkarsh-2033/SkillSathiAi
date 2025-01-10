import React, { useState, useEffect } from "react";
import Timer from "../componenets/Games/Timer1.jsx";
import Dropdownbar from "../componenets/Games/Dropdownbar.jsx";
import GameResult from "../componenets/Games/Gameresult1.jsx";
import styles from "./puzzleword.module.css";
import FloatingBalls from "../componenets/Games/floatingballs.jsx";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice.js";
function generateWordSearch(gridSize, wordList) {
  const grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null));
  const directions = [
    { dx: 0, dy: 1 },
    { dx: 1, dy: 0 },
  ];

  const isValidPosition = (x, y, word, direction) => {
    const endX = x + direction.dx * (word.length - 1);
    const endY = y + direction.dy * (word.length - 1);
    if (endX < 0 || endY < 0 || endX >= gridSize || endY >= gridSize)
      return false;

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
      const direction =
        directions[Math.floor(Math.random() * directions.length)];
      if (isValidPosition(x, y, upperWord, direction)) {
        for (let i = 0; i < upperWord.length; i++) {
          grid[x + direction.dx * i][y + direction.dy * i] = upperWord[i];
        }
        placed = true;
      }
    }
  };

  wordList.forEach((word) => placeWord(word));
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
  const user=useSelector(selectUser)
  const gridSize = 10;
  const [wordList] = useState(["hypertext", "react", "mysql", "git", "python"]);

  const updateHints = (subject) => {
    let wordList = [];
    let newHints = {};

    switch (subject) {
      case "WEB DEVELOPMENT":
        wordList = ["hyper", "react", "mysql", "git", "python"];
        newHints = {
          hypertext: "What does H in HTML stand for?",
          react: "Which of the following is a JavaScript framework?",
          mysql: "What is used for creating databases in web development?",
          git: "Which tool is used for version control in web development?",
          python:
            "Which programming language is primarily used for backend web development?",
        };
        break;
      case "DATA SCIENCE":
        wordList = ["python", "pandas", "numpy", "tensorflow", "ml"];
        newHints = {
          python:
            "Which programming language is primarily used for data science?",
          pandas: "Which library is used for data manipulation?",
          numpy: "Which library is used for numerical computations?",
          tensorflow: "Which library is used for machine learning?",
          ml: "Which field involves training models to predict outcomes?",
        };
        break;
      case "UI/UX DESIGNER":
        wordList = ["clarity", "mockup", "usable", "wireframe", "ease"];
        newHints = {
          Clarity: "What’s the most important design principle?",
          mockup: "What is a visual representation of a design called?",
          usable: "Which term refers to the ease of use of a product?",
          wireframe: "What is the blueprint of a design called?",
          ease: "What is key for web design?",
        };
        break;
      case "FINANCIAL ANALYST":
        wordList = ["stock", "export", "sav", "equity", "bonds"];
        newHints = {
          stock: "What are shares of ownership in a company called?",
          Export: "What commands is used to save the output in SPSS?",
          sav: "What is file extension for an SPSS data file?",
          equity: "What term refers to ownership shares in a company?",
          bonds: "What are debt securities issued by companies or governments?",
        };
        break;
      case "PRODUCT MANAGER":
        wordList = ["roadmap", "backlog", "scrum", "select", "release"];
        newHints = {
          roadmap: "What is a strategic plan for a product's development?",
          backlog: "What is the list of tasks and features to be completed?",
          scrum: "What is the agile framework for managing projects?",
          select:
            "Which SQL statement is used to retrieve data from a database?",
          release: "What is the final launch of a product or feature called?",
        };
        break;

      default:
        wordList = ["hyper", "react", "mysql", "git", "python"];
        newHints = {
          hypertext: "What does H in HTML stand for?",
          react: "Which of the following is a JavaScript framework?",
          mysql: "What is used for creating databases in web development?",
          git: "Which tool is used for version control in web development?",
          python:
            "Which programming language is primarily used for backend web development?",
        };
    }
    setHints(newHints);
    setGrid(generateWordSearch(gridSize, wordList));
  };
  const [grid, setGrid] = useState(() =>
    generateWordSearch(gridSize, wordList)
  );
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [hints, setHints] = useState({});
  const [highlightedCells] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

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

  const handleCellSelect = (row, col) => {
    if (isTimeUp) return;
    const newSelectedCells = [...selectedCells, { row, col }];

    if (newSelectedCells.length > 1) {
      const [start, end] = [
        newSelectedCells[0],
        newSelectedCells[newSelectedCells.length - 1],
      ];
      const isSameRow = start.row === end.row;
      const isSameColumn = start.col === end.col;
      if (!isSameRow && !isSameColumn) return;
    }

    setSelectedCells(newSelectedCells);
    const word = newSelectedCells
      .map(({ row, col }) => grid[row][col])
      .join("");

    if (
      wordList.includes(word.toLowerCase()) &&
      !foundWords.includes(word.toLowerCase())
    ) {
      const newFoundWords = [...foundWords, word.toLowerCase()];
      setFoundWords(newFoundWords);
      setSelectedCells([]);

      if (newFoundWords.length === wordList.length) {
        clearInterval(timerInterval);
        setIsTimeUp(true);
        setShowResult(true);
        setTimeout(() => {
          setShowResult(false);
        }, 100000);
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

 
  return (
    <div className={styles.app}>
      <FloatingBalls />
      <div className={styles.head}>
        <p>Word Search Puzzle</p>
      </div>
      <div className={styles.topper}>
        <div className={styles.Dropdownbar}>
          <Dropdownbar updateHints={updateHints} />
        </div>
        <div className={styles.timer}>
          <Timer key={timeLeft} timeLeft={timeLeft} onTimeUp={onTimeUp} />
        </div>
        <div>
          <button
            className={styles.reset}
            onClick={resetPuzzle}
            style={{ marginTop: "20px" }}
          >
            Reset Puzzle
          </button>
        </div>
      </div>
      {showResult && isTimeUp && (
        <GameResult
          isWin={foundWords.length === wordList.length}
          resetPuzzle={resetPuzzle}
          userId={user._id}
        />
      )}
      <div className={styles.hintsandgrid}>
        <div className={styles.hints}>
          <h3>Hints:</h3>
          <ul>
            {Object.entries(hints).map(([word, hint]) => (
              <p key={word} style={{ fontSize: "20px" }}>
                {hint}
              </p>
            ))}
          </ul>
        </div>
        <div
          className={styles.grid}
          style={{
            display: "grid",
            marginBottom: "50px",
            gridTemplateColumns: `repeat(${gridSize}, 40px) `,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={styles.cell}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid #272626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "18px",
                  backgroundColor: selectedCells.some(
                    ({ row, col }) => row === rowIndex && col === colIndex
                  )
                    ? "white"
                    : "transparent",
                  color: highlightedCells.has(`${rowIndex}-${colIndex}`)
                    ? "green"
                    : "black",
                }}
                onClick={() => handleCellSelect(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </div>

      {/* <div className={styles.foundWords}>
        <h3>Words Found:</h3>
        <ul>
          {foundWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default PuzzleQuiz;
