import React from "react";
import { useNavigate } from "react-router-dom";


const GameSelectionPage = () => {
  const navigate = useNavigate();


  const games = [
    {
      id: "sudoku",
      name: "Sudoku",
      description: "Challenge your mind with classic Sudoku puzzles.",
      image: "https://img.freepik.com/premium-photo/colorful-sudoku-unraveling-background-mindbending-puzzle_983420-30516.jpg", // Replace with actual image
      path: "/game/sudoku", // Route to Sudoku game page
    },
    {
      id: "quiz",
      name: "Quiz",
      description: "Test your knowledge with exciting quizzes.",
      image: "https://as1.ftcdn.net/v2/jpg/02/19/99/80/1000_F_219998038_1RgWtMp4G21KZQhmzGl1fE8rY8d1wmQn.jpg", // Replace with actual image
      path: "/game/puzzle-quiz", // Route to Quiz game page
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-8">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => navigate(game.path)}
          >
            <img
              src={game.image}
              alt={game.name}
              className="rounded-t-lg w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800">{game.name}</h3>
              <p className="text-gray-600 mt-2">{game.description}</p>
              <button className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-all">
                Play {game.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default GameSelectionPage;
