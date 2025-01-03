import React, { useState, useEffect } from "react";
import "./Sudoku.css";
import SubjectDropdown from "../componenets/Games/Dropdown";


function generateValidSudoku(gridSize) {
  const grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill({ value: null, isQuiz: false }));


  const isSafeToPlace = (grid, row, col, num) => {
    for (let i = 0; i < gridSize; i++) {
      if (grid[row][i]?.value === num || grid[i][col]?.value === num) {
        return false;
      }
    }


    const subGridSize = Math.sqrt(gridSize);
    const startRow = row - (row % subGridSize);
    const startCol = col - (col % subGridSize);


    for (let i = 0; i < subGridSize; i++) {
      for (let j = 0; j < subGridSize; j++) {
        if (grid[startRow + i][startCol + j]?.value === num) {
          return false;
        }
      }
    }
    return true;
  };


  const fillGrid = (row = 0, col = 0) => {
    if (row === gridSize) return true;
    if (col === gridSize) return fillGrid(row + 1, 0);


    for (let num = 1; num <= gridSize; num++) {
      if (isSafeToPlace(grid, row, col, num)) {
        grid[row][col] = { value: num, isQuiz: false };
        if (fillGrid(row, col + 1)) return true;
        grid[row][col] = { value: null, isQuiz: false };
      }
    }
    return false;
  };


  fillGrid();


  const removeCells = () => {
    const totalCellsToRemove = Math.floor(gridSize * gridSize * 0.5);
    let removed = 0;
    while (removed < totalCellsToRemove) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (grid[row][col]?.value !== null) {
        grid[row][col] = { value: null, isQuiz: true };
        removed++;
      }
    }
  };


  removeCells();
  return grid;
}


const SudokuGame = () => {
  const gridSize = 9;
  const [grid, setGrid] = useState(() => generateValidSudoku(gridSize));
  const [quizModal, setQuizModal] = useState({ isOpen: false, question: "", options: [], onAnswer: null });
  const [timer, setTimer] = useState(300); // 5-minute timer
  const [gameResult, setGameResult] = useState(null);


  const quizQuestions = [
    {
      question: "Which tag is used to create a line break in HTML?",
      options: ["<br>", "<hr>", "<line>", "<break>"],
      correctAnswer: "<br>",
    },
    {
      question: "What is the fullform of CSS",
      options: ["cascon style sheets", "cascon sheets style", "Cascading style sheets"],
      correctAnswer: "Cascading style sheets",
    },
    {
      question: "Which of the following is a JavaScript framework?",
      options: ["Mars", "react", "C"],
      correctAnswer: "react",
    },
    {
      question: "Which attribute is used to provide a unique identifier for an HTML element?",
      options: ["id", "class", "name", "tag"],
      correctAnswer: "id",
    },
    {
      question: "Which programming language is primarily used for web development?",
      options: ["Python", "JavaScript", "C++"],
      correctAnswer: "JavaScript",
    },
    {
      question: "What does SAP stand for?",
      options: ["Systematic Application Protocol", "Systeme, Anwendungen und Produkte in der Datenverarbeitung", "Simple Application Platform"],
      correctAnswer: "Systeme, Anwendungen und Produkte in der Datenverarbeitung",
    },
    {
      question: "What does the Array.prototype.map() method return?",
      options: ["A new array", "A modified array", "An object", "Undefined"],
      correctAnswer: "A new array",
    },
    {
      question: "What is the purpose of the Reflect API in JavaScript?",
      options: [
        "Provides methods for interceptable JavaScript operations",
        "Defines advanced reflection techniques",
        "Accesses global variables",
        "Executes asynchronous functions",
      ],
      correctAnswer: "Provides methods for interceptable JavaScript operations",
    },
    {
      question: "What is metaprogramming in Ruby?",
      options: [
        "Writing code that writes code",
        "Debugging code",
        "Refactoring large applications",
        "Compiling Ruby code",
      ],
      correctAnswer: "Writing code that writes code",
    },
    {
      question: "What does the alias keyword do in Ruby?",
      options: [
        "Creates a new name for an existing method",
        "Defines a static method",
        "Calls a method from a superclass",
        "Overrides a method in a class",
      ],
      correctAnswer: "Creates a new name for an existing method",
    },
    {
      question: "What is the difference between Proc and Lambda in Ruby?",
      options: [
        "Lambdas check the number of arguments; Procs do not",
        "Procs are immutable; Lambdas are mutable",
        "Lambdas are faster than Procs",
        "There is no difference between the two",
      ],
      correctAnswer: "Lambdas check the number of arguments; Procs do not",
    },
    {
      question: "Which command is used to create a new table in MySQL?",
      options: ["CREATE TABLE", "INSERT TABLE", "NEW TABLE", "MAKE TABLE"],
      correctAnswer: "CREATE TABLE",
    },
    {
      question: "What is the primary purpose of the 'cluster' module in Node.js?",
      options: [
        "To enable multi-core processing",
        "To debug applications",
        "To handle large file uploads",
        "To manage dependencies",
      ],
      correctAnswer: "To enable multi-core processing",
    },
    {
      question: "Which debugging tool is commonly used with Node.js?",
      options: ["Node Inspector", "Redux DevTools", "Webpack", "Jasmine"],
      correctAnswer: "Node Inspector",
    },
    {
      question: "Which method is used to get all keys from a dictionary?",
      options: ["keys()", "getKeys()", "items()", "allKeys()"],
      correctAnswer: "keys()",
    },
    {
      question: "Which Python library is commonly used for data analysis?",
      options: ["pandas", "numpy", "matplotlib", "flask"],
      correctAnswer: "pandas",
    },
  ];


  const handleCellClick = (row, col) => {
    const cell = grid[row][col];


    if (cell.isQuiz) {
      const quiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
      setQuizModal({
        isOpen: true,
        question: quiz.question,
        options: quiz.options,
        onAnswer: (answer) => handleQuizAnswer(row, col, answer, quiz.correctAnswer),
      });
    }
  };


  const handleQuizAnswer = (row, col, answer, correctAnswer) => {
    if (answer === correctAnswer) {
      const updatedGrid = [...grid];
      updatedGrid[row][col] = { value: Math.floor(Math.random() * 9) + 1, isQuiz: false };
      setGrid(updatedGrid);
      setQuizModal({ ...quizModal, isOpen: false });
    } else {
      alert("Wrong answer. Try again!");
    }
  };


  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setGameResult("lose");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);


    return () => clearInterval(timerInterval);
  }, []);


  const resetPuzzle = () => {
    setGrid(generateValidSudoku(gridSize));
    setTimer(300);
    setGameResult(null);
  };


  return (
    <div className="sudoku-game-container">
      <h1>Solve the Puzzle</h1>
      <SubjectDropdown />
      <button onClick={resetPuzzle} className="sudoku-game-reset">Reset Puzzle</button>
      <div className="sudoku-game-timer">Time Left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</div>
      <div className="sudoku-game-board">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`sudoku-game-cell ${cell.isQuiz ? "sudoku-game-quiz-cell" : ""}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell.value || ""}
            </div>
          ))
        )}
      </div>


      {quizModal.isOpen && (
        <div className="sudoku-game-quiz-modal">
          <div className="sudoku-game-modal-content">
            <h3>{quizModal.question}</h3>
            <div className="sudoku-game-quiz-options">
              {quizModal.options.map((option, index) => (
                <button key={index} onClick={() => quizModal.onAnswer(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default SudokuGame;
