import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCoins } from 'react-icons/fa'; // Coin icon from react-icons
import axios from 'axios'; // To make API requests
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";


const GameSelectionPage = () => {
  const navigate = useNavigate();
  const [userCoins, setUserCoins] = useState(0);
  const user = useSelector(selectUser);
  const userId = user._id;

  // Fetch the user's rewards (coins)
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`);
        if (response.status === 200 && response.data.rewards) {
          setUserCoins(response.data.rewards.coins); // Assuming 'coins' is a property of rewards
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };


    fetchRewards();
  }, [userId]); // Fetch when the component mounts or userId changes


  const games = [
    {
      id: "sudoku",
      name: "Sudoku",
      description: "Challenge your mind with classic Sudoku puzzles.",
      image: "https://img.freepik.com/premium-photo/colorful-sudoku-unraveling-background-mindbending-puzzle_983420-30516.jpg",
      path: "/game/sudoku",
    },
    {
      id: "quiz",
      name: "PuzzleQuiz",
      description: "Test your knowledge with exciting quizzes.",
      image: "https://as1.ftcdn.net/v2/jpg/02/19/99/80/1000_F_219998038_1RgWtMp4G21KZQhmzGl1fE8rY8d1wmQn.jpg",
      path: "/game/puzzle-quiz",
    },
  ];


  return (
    <div className="min-h-screen flex flex-col gap-8 bg-gradient-to-br from-blue-400 to-purple-600  items-center justify-center p-6">
      <div className=" text-center p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800">Your Rewards</h3>
        <div className="flex justify-center items-center mt-4">
          <FaCoins className="text-yellow-500 text-4xl mr-2" />
          <p className="text-xl text-gray-700">You have {userCoins} coins!</p>
        </div>
        <p className="mt-4 text-gray-600">Keep playing to earn more rewards and level up!</p>
      </div>
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


      {/* Reward Display */}
     
    </div>
  );
};


export default GameSelectionPage;


