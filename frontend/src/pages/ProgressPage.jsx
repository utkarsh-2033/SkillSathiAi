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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const colors = [
    "#8B008B", "#FF1493", "#FF4500", "#FFD700", "#32CD32",
    "#1E90FF", "#4B0082", "#9400D3", "#FF69B4", "#00CED1",
    "#DC143C", "#FF6347", "#7B68EE", "#FF8C00", "#00FA9A", "#20B2AA",
  ];


  const getColor = (index) => colors[index % colors.length];


  // Combined fetch logic to avoid redundancy
  useEffect(() => {
    const fetchProgressData = async () => {
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


        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load progress. Please try again later.");
        setLoading(false);
      }
    };


    fetchProgressData();
  }, [userId]);


  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }


  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }


  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Progress Overview</h1>


      {/* Chart Section */}
      <div className="bg-white p-4 rounded-md shadow-md mb-6">
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


      {/* Cards Section */}
      <div>
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
                <span className="font-bold">Date & Time:</span>{" "}
                {entry.dateTimeGiven}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Test Score:</span> {entry.testScore}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Time Taken:</span>{" "}
                {entry.timeTaken} seconds
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ProgressPage;
