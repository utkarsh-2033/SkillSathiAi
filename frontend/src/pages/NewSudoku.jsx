import React, { useState, useEffect } from "react";
import SubjectDropdown from '../componenets/Games/DropdownbarSudoko.jsx';
import styles from './sudokustyle.module.css'
import FloatingBalls from '../componenets/Games/floatingstarsSudoko.jsx'
import axios from "axios"; // Importing axios for making API requests
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice.js";
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

const quizQuestions = {
  "UI/UX DESIGNER": [
    { question: "What does UX stand for?", options: ["User Experience", "User Extension", "Unified Experience", "User Experiment"], correctAnswer: "User Experience" },
    { question: "Which tool is commonly used for UI design?", options: ["Figma", "Excel", "Photoshop", "Notepad"], correctAnswer: "Figma" },
    { question: "What does UX stand for in design?", options: ["User Experience", "User Expansion", "Universal Experience", "Usability Expertise"], correctAnswer: "User Experience" },
    { question: "Which of the following is a key principle of good UI design?", options: ["Aesthetic consistency", "Adding as many colors as possible", "Minimal user interaction", "Notepad"], correctAnswer: "Aesthetic consistency" },
    { question: "What is a wireframe in UI/UX design?", options: ["A full-color prototype", "A detailed user flowchart", "A simple visual guide to the layout of a design", "A graphic illustrating user personas"], correctAnswer: "A simple visual guide to the layout of a design" },
    { question: "Which is NOT a benefit of UX/UI collaboration tools?", options: ["Real-time collaboration", "Improved accessibility", "Automatic coding", "Centralized feedback"], correctAnswer: "Automatic coding" },
    { question: "What is a user persona?", options: ["A fictional representation of an ideal user", "An actual customer interview", "A competitor analysis tool", "A marketing strategy"], correctAnswer: "A fictional representation of an ideal user" },
    { question: "Which of the following is a key feature of accessibility in web design?", options: ["Dynamic animations", "High contrast modes", "Flashy graphics", "Complex navigation"], correctAnswer: "High contrast modes" },
    { question: "What does the term 'affordance' mean in UX design?", options: ["The cost of implementing a feature", "The perceived action possibilities of an object", "Aesthetic appeal of a design element", "User engagement over time"], correctAnswer: "The perceived action possibilities of an object" },
    { question: "Which principle of UX design emphasizes designing for error prevention?", options: ["Flexibility and efficiency", "Error recovery", "Error prevention", "User control and freedom"], correctAnswer: "Error prevention" },
  ],
  "WEB DEVELOPMENT": [
  { question: "Which language is primarily used for creating the structure of web pages?", options: ["HTML", "CSS", "JavaScript", "PHP"], correctAnswer: "HTML" },
  { question: "Which language is used to make web pages interactive?", options: ["HTML", "CSS", "JavaScript", "SQL"], correctAnswer: "JavaScript" },
  { question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets"], correctAnswer: "Cascading Style Sheets" },
  { question: "Which HTML element is used to link to external stylesheets?", options: ["<script>", "<style>", "<link>", "<css>"], correctAnswer: "<link>" },
  { question: "What is the default method for sending form data in HTML?", options: ["POST", "GET", "PUT", "DELETE"], correctAnswer: "GET"  },
  { question: "Which of the following is a CSS framework?", options: ["Bootstrap", "Django", "Node.js", "Laravel"], correctAnswer: "Bootstrap" },
  { question: "What is the purpose of the 'alt' attribute in an <img> tag?", options: ["To display the image source", "To add alternative text for accessibility", "To add a hyperlink to the image", "To specify the image's dimensions"], correctAnswer: "To add alternative text for accessibility" },
  { question: "Which protocol is used for secure communication over the web?", options: ["HTTP", "HTTPS", "FTP", "SMTP"], correctAnswer: "HTTPS" }
],

  "DATA SCIENCE": [
  { question: "Which of the following is a key responsibility of a Data Analyst?", options: ["Developing machine learning models", "Creating financial reports", "Cleaning and organizing data", "Designing software architecture"],correctAnswer: "Cleaning and organizing data"},
  { question: "Which tool is commonly used for data visualization?",options: ["Excel", "Tableau", "PowerPoint", "Photoshop"],correctAnswer: "Tableau"},
  { question: "What does SQL stand for?",options: ["Structured Query Language", "Sequential Query Language", "System Query Logic", "Standard Query Layout"],correctAnswer: "Structured Query Language"},
  { question: "Which of the following is a popular programming language for data analysis?", options: ["Java", "Python", "C++", "PHP"], correctAnswer: "Python"},
  { question: "What type of chart is best used to show trends over time?", options: ["Pie Chart", "Line Chart", "Bar Chart", "Scatter Plot"],correctAnswer: "Line Chart"},
  { question: "Which function in Excel is used to calculate the average of a dataset?", options: ["SUM()", "COUNT()", "AVERAGE()", "MEDIAN()"],correctAnswer: "AVERAGE()"},
  { question: "What is data cleaning?", options: ["Removing useful data", "Formatting data for analysis", "Creating new datasets", "Merging multiple datasets"],correctAnswer: "Formatting data for analysis"},
  { question: "Which term refers to a large volume of data that grows over time?", options: ["Data Mining", "Data Lake", "Big Data", "Data Frame"], correctAnswer: "Big Data"}
],

  "FINANCIAL ANALYST": [
  { question: "What is the primary goal of financial analysis?",options: ["Maximizing shareholder wealth", "Minimizing employee turnover", "Reducing taxes", "Increasing market share"],correctAnswer: "Maximizing shareholder wealth"},
  { question: "Which of the following is a financial statement that shows a company's profitability?",options: ["Balance Sheet", "Income Statement", "Cash Flow Statement", "Statement of Retained Earnings"],correctAnswer: "Income Statement"},
  { question: "What does ROI stand for in financial analysis?",options: ["Rate of Interest", "Return on Investment", "Rate of Inflation", "Return on Income"],correctAnswer: "Return on Investment" },
  { question: "Which ratio measures a company's ability to meet its short-term obligations?", options: ["Debt-to-Equity Ratio", "Current Ratio", "Earnings Per Share", "Price-to-Earnings Ratio"],correctAnswer: "Current Ratio"},
  { question: "What is the process of evaluating a project's potential profitability called?", options: ["Cost Analysis", "Budgeting", "Capital Budgeting", "Risk Management"],correctAnswer: "Capital Budgeting"},
  { question: "Which financial metric shows how much profit a company makes for each dollar of sales?", options: ["Gross Profit Margin", "Net Income", "Earnings Per Share", "Quick Ratio"],correctAnswer: "Gross Profit Margin"},
  { question: "What does the term 'liquidity' refer to in financial analysis?",options: ["A company's profitability", "A company's cash flow", "A company's ability to pay off short-term liabilities", "A company's long-term growth"],correctAnswer: "A company's ability to pay off short-term liabilities"},
  { question: "Which of the following is considered a long-term liability?",options: ["Accounts Payable", "Short-term Loans", "Mortgage Payable", "Accrued Expenses"],correctAnswer: "Mortgage Payable"}
],

  "PRODUCT MANAGER": [
  { question: "What is the main responsibility of a product manager?", options: ["Developing marketing strategies", "Managing product lifecycle", "Writing code", "Designing product logos"], correctAnswer: "Managing product lifecycle"},
  { question: "Which document typically outlines the features and requirements of a product?", options: ["Product Backlog", "Product Roadmap", "Product Requirements Document (PRD)", "User Story Map"], correctAnswer: "Product Requirements Document (PRD)"},
  { question: "What is a product backlog?", options: ["A list of marketing strategies", "A list of customer feedback", "A prioritized list of product features and tasks", "A list of sales leads"],correctAnswer: "A prioritized list of product features and tasks"},
  { question: "Which of the following is a method for defining customer needs in product management?", options: ["SWOT Analysis", "Market Research", "User Persona", "Sales Reports"],correctAnswer: "User Persona"},
  { question: "Which of the following best describes the role of a product manager in Agile development?", options: ["Writing test cases", "Coding the product features", "Prioritizing the product backlog", "Managing customer support"], correctAnswer: "Prioritizing the product backlog"},
  { question: "What is the purpose of a product roadmap?", options: ["To showcase product features over time", "To track financial performance", "To monitor team progress", "To measure customer satisfaction"], correctAnswer: "To showcase product features over time" },
  { question: "What is an MVP (Minimum Viable Product)?",options: ["A fully developed product", "A product with only essential features to solve a core problem", "A product with no testing", "A product with marketing content"],correctAnswer: "A product with only essential features to solve a core problem"},
  { question: "Which metric is often used to measure product success?",options: ["Customer Retention Rate", "Advertising Spend", "Employee Turnover Rate", "Inventory Levels"],correctAnswer: "Customer Retention Rate"}
],
};

const Sudoku = () => {
  const gridSize = 9;
  const [grid, setGrid] = useState(() => generateValidSudoku(gridSize));
  const [quizModal, setQuizModal] = useState({ isOpen: false, question: "", options: [], onAnswer: null });
  const [timer, setTimer] = useState(300); // 5-minute timer
  const [gameResult, setGameResult] = useState(null); // Track game result
  const [selectedSubject, setSelectedSubject] = useState("WEB DEVLOPMENT"); // Default subject
  const [rewardAdded, setRewardAdded] = useState(false); // To prevent adding reward multiple times
const user=useSelector(selectUser);
const userId=user._id;
  const coinsWon = 5; 

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
  };

  const handleCellClick = (row, col) => {
    const cell = grid[row][col];

    if (cell.isQuiz) {
      const questions = quizQuestions[selectedSubject] || [];
      if (questions.length === 0) {
        alert("No questions available for this subject.");
        return;
      }

      const quiz = questions[Math.floor(Math.random() * questions.length)];
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
      checkGameResult(updatedGrid);
      setQuizModal({ ...quizModal, isOpen: false });
    } else {
      alert("Wrong answer. Try again!");
    }
  };

  const checkGameResult = (updatedGrid) => {
    const isCompleted = updatedGrid.every(row => row.every(cell => cell.value !== null));
    if (isCompleted) {
      setGameResult("win");
    }
  };
  const addReward = async () => {
    if (!rewardAdded) {
      try {
        // Replace '/user/add' with your API endpoint for adding coins
        await axios.post("/user/add", { userId, coinsWon }); // Replace 'userId' as per your actual implementation
        alert(`Congratulations! You've won ${coinsWon} coins!`);
        setRewardAdded(true); // Set flag to true after adding the reward
      } catch (error) {
        console.error("Error adding reward:", error);
      }
    }
  };
  useEffect(() => {
    if (gameResult === "win") {
      addReward(); // Add the reward when the game is won
    }
  }, [gameResult]); //
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
    setTimer(90);
    setGameResult(null);
  };

  return (
    <div className={styles.sudokucontainer}>
      <FloatingBalls/>
      <div className={styles.head}><p>SOLVE THE PUZZLE</p></div>
          <div className={styles.topper}>
                <div className={styles.Dropdownbar}><SubjectDropdown updateHints={handleSubjectChange} /></div>
                  <div className={styles.timer}>Time Left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</div>
                <div> <button onClick={resetPuzzle} className={styles.reset}>Reset Puzzle</button></div> 
          </div>

          {gameResult === "win" && <div className={styles.gameresult}>Congratulations! You've completed the puzzle!😎</div>}
          {gameResult === "lose" && <div className={styles.gameresult}>Time's up! You lost the game.😔😓</div>}


<div className={styles.grid}>
      <div className={styles.sudokuboard}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${styles.cell} ${cell.isQuiz ? styles['quiz-cell'] : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell.value || ""}
            </div>
          ))
        )}
      </div>
  </div>
      {quizModal.isOpen && (
        <div className={styles.quizModal}>
          <div className={styles.ModalContent}>
            <p className={styles.text}>{quizModal.question}</p>
            <div className={styles.quizOptions}>
              {quizModal.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => quizModal.onAnswer(option)}
                  className={styles.quizOptionsbutton}
                >
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

export default Sudoku;
