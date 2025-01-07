import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import ReactMarkdown from "react-markdown";

const LearningPath = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useSelector(selectUser);

  const parseTable = (tableText) => {
    const lines = tableText.split("\n").filter((line) => line.trim() !== "");
    // const rows = lines
    //   .slice(3)
    //   .map((row) => row.split("|").map((cell) => cell.trim()));
    const rows = lines
      .slice(1)
      .map((row) => row.split("|").map((cell) => cell.trim()));

    return rows.map((row) => ({
      skill: row[0],
      importance: row[1],
      concepts: row[2],
      objectives: row[3],
      resources: row[4],
    }));
  };

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const response = await fetch(
          `user/api/learning-path-timeline/${user._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the learning path.");
        }
        const result = await response.json();
        // Extract and format table
        const tableText = result.learningPathFeedback
          .split("**2. Learning Path:**")[1]
          .split("**3. Capstone Project:**")[0]
          .trim();
        const tableData = parseTable(tableText);

        const capstoneText = result.learningPathFeedback
          .split("**3. Capstone Project:**")[1]
          .split("**4. Timeline Summary:**")[0]
          .trim();

        const timelineText = result.learningPathFeedback
          .split("**4. Timeline Summary:**")[1]
          .trim();

        setData({
          ...result,
          tableData: Array.isArray(tableData) ? tableData : [], // Ensure it's an array
          capstoneText,
          timelineText,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-blue-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Your Learning Pathway
        </h1>

        {/* Career Goal */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-600">
            Career Goal:{" "}
            <span className="text-blue-600">{data.careerGoal}</span>
          </h2>
        </div>

        {/* Skill Prioritization */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            1. Skill Prioritization:
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2">
            <ReactMarkdown className="prose">
              {data.learningPathFeedback.split("**2. Learning Path:**")[0]}
            </ReactMarkdown>
          </div>
        </div>

        {/* Learning Path Table */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            2. Learning Path:
          </h3>
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Skill/Framework
                </th>
                {/* <th className="border border-gray-300 px-4 py-2 text-left">
                  Importance for React.js Developer
                </th> */}
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Key Concepts & Practical Applications
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Week-wise Learning Objectives
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Resources
                </th>
              </tr>
            </thead>
            <tbody>
              {data.tableData && data.tableData.length > 0 ? (
                data.tableData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    {/* <td className="border border-gray-300 px-4 py-2">
                      <ReactMarkdown>{row.skill}</ReactMarkdown>
                    </td> */}
                    <td className="border border-gray-300 px-4 py-2">
                      <ReactMarkdown>{row.importance}</ReactMarkdown>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <ReactMarkdown>{row.concepts}</ReactMarkdown>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <ReactMarkdown>{row.objectives}</ReactMarkdown>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <ReactMarkdown>{row.resources}</ReactMarkdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-4 py-2 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Capstone Project */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            3. Capstone Project:
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2">
            <ReactMarkdown className="prose">{data.capstoneText}</ReactMarkdown>
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            4. Timeline Summary:
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2">
            <ReactMarkdown className="prose">{data.timelineText}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
