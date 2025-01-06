import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";


const ProgressPage = () => {
  const { userId } = useParams();
  const [progressData, setProgressData] = useState([]);
  const [progressAllData, setProgressAllData] = useState([]);
  const [skillProficiency, setSkillProficiency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const colors = [
    "#8B008B", "#FF1493", "#FF4500", "#FFD700", "#32CD32",
    "#1E90FF", "#4B0082", "#9400D3", "#FF69B4", "#00CED1",
    "#DC143C", "#FF6347", "#7B68EE", "#FF8C00", "#00FA9A", "#20B2AA",
  ];


  const getColor = (index) => colors[index % colors.length];


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);


        // Fetch filtered progress
        const filteredResponse = await axios.get(`/user/filteredprogress/${userId}`);
        const progressArray = filteredResponse.data.map((entry) => ({
          skillName: entry.skillName,
          level: entry.level,
          testScore: entry.testScore,
          timeTaken: entry.timeTaken,
          dateTimeGiven: new Date(entry.dateTimeGiven).toLocaleString(),
        }));


        // Sort filtered progress by date
        const sortedFilteredData = progressArray.sort(
          (a, b) => new Date(b.dateTimeGiven) - new Date(a.dateTimeGiven)
        );
        setProgressData(sortedFilteredData);


        // Fetch all progress
        const allResponse = await axios.get(`/user/allprogress/${userId}`);
        setProgressAllData(allResponse.data);


        // Fetch skill proficiency assessment
        const skillResponse = await axios.get(`/user/skillassessment/${userId}`);
        setSkillProficiency(skillResponse.data);


        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };


    fetchData();
  }, [userId]);


  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }


  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }


  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Progress Overview</h1>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="md:col-span-2 bg-white p-4 rounded-md shadow-md">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={progressData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skillName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="testScore" name="Test Score">
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>


        {/* Skill Proficiency Card */}
        {skillProficiency && (
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Skill Proficiency</h2>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Skill Names:</span> {skillProficiency.input_data.skill_name.join(", ")}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Difficulty Average:</span> {skillProficiency.input_data.difficulty_avg.join(", ")}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Levels:</span> {skillProficiency.input_data.level.join(", ")}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Scores:</span> {skillProficiency.input_data.score.join(", ")}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Time Taken Average:</span> {skillProficiency.input_data.time_taken_avg.join(", ")}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Predictions:</span> {skillProficiency.predictions.join(", ")}
            </p>
          </div>
        )}
      </div>


      {/* Cards Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Test Details</h2>
        <div className="flex flex-col gap-4">
          {progressAllData.map((entry, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-violet-900 mb-2">
                {entry.skillName}
              </h3>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Level:</span> {entry.level}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Date & Time:</span> {entry.dateTimeGiven}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Test Score:</span> {entry.testScore}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Time Taken:</span> {entry.timeTaken} seconds
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ProgressPage;
