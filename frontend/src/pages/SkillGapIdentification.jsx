import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const SkillGapIdentificationPage = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [quizProgress, setQuizProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formattedData, setFormattedData] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Fetch the user's quiz progress from the last 24 hours
    fetch(`/user/api/quiz-progress/${user._id}`)
      .then((response) => response.json())
      .then((data) => {
        setQuizProgress(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz progress:", error);
        setLoading(false);
      });
  }, [user._id]);

  // Format the data for the ML model
  const formatDataForML = (quizProgress) => {
    const levelMapping = {
      easy: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    };

    const skillNames = [];
    const levels = [];
    const scores = [];
    const timeTakenAvg = [];
    const difficultyAvg = []; // Assuming difficulty is a calculated or existing field in your data

    quizProgress.forEach((progress) => {
      skillNames.push(progress.skillName);
      levels.push(levelMapping[progress.level]); // Use the mapping for proper capitalization
      scores.push(progress.testScore);
      timeTakenAvg.push(Math.floor(progress.timeTaken / 60)); // Convert time to minutes
      difficultyAvg.push(progress.difficulty || 3); // Set a default difficulty if not available
    });

    return {
      score: scores,
      time_taken_avg: timeTakenAvg,
      difficulty_avg: difficultyAvg,
      skill_name: skillNames,
      level: levels,
    };
  };

  const handleSendData = () => {
    setIsSending(true);

    const data = formatDataForML(quizProgress);
    setFormattedData(data);

    // Simulate sending data to backend
    console.log("Sending data for proficiency testing:", data);
    console.log(data)
    // Add your backend request here to send the data for processing
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Data sent successfully:", result);
        setIsSending(false);
        // alert("Data sent successfully for processing.");
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        setIsSending(false);
        alert("Error sending data.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Recent Test Results</h1>
        {loading ? (
          <div>Loading...</div>
        ) : quizProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizProgress.map((progress, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-100 to-blue-50 shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                <h3 className="text-2xl font-semibold text-blue-700">
                  {progress.skillName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Level:{" "}
                  <span className="font-medium text-blue-500">{progress.level}</span>
                </p>
                <div className="mt-4">
                  <p className="font-medium text-gray-800">
                    Test Score:{" "}
                    <span className="text-blue-500">{progress.testScore}</span>
                  </p>
                  <p className="font-medium text-gray-800">
                    Time Taken:{" "}
                    <span className="text-blue-500">
                      {Math.floor(progress.timeTaken / 60)} min
                    </span>
                  </p>
                  <p className="font-medium text-gray-800">
                    Average Difficulty:{" "}
                    <span className="text-blue-500">{progress.difficulty || 3}</span>
                  </p>
                  <p
                    className={`font-medium mt-4 ${
                      progress.isPassed ? "text-green-600" : "text-red-600"
                    } bg-opacity-30 rounded-full px-2 py-1 inline-block`}
                  >
                    {progress.isPassed ? "Passed" : "Failed"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No quizzes completed in the last 24 hours.</div>
        )}
      </div>

      <div className="mt-6 text-center">
        {/* Button to send data for proficiency testing */}
        <button
          onClick={handleSendData}
          disabled={isSending}
          className={`bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-all ${
            isSending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSending ? "Sending..." : "Send for Proficiency Testing"}
        </button>
      </div>
    </div>
  );
};

export default SkillGapIdentificationPage;
