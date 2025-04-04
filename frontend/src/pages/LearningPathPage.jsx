import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LearningPath = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useSelector(selectUser);
  const navigate=useNavigate();

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
         `${import.meta.env.VITE_BACKEND_URL}user/api/learning-path-timeline/${user._id}`
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

  //pdf
  const downloadAsPDF = () => {
    const input = document.getElementById("contentToConvert");

    // Set the options for html2canvas to capture the full content
    const options = {
      scale: 2, // Increase the scale to improve the quality
      useCORS: true,
    };

    html2canvas(input, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add more pages if necessary
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("learning_path.pdf");
    });
  };

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
      <div className="my-3 mb-6 flex flex-row gap-8 justify-center items-center">
        <button
          onClick={() => {
            navigate("/");
          }}
          className=" bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-md text-xl font-bold shadow-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition duration-300 transform hover:scale-105"
        >
          Go Back to Home Page
        </button>
        <button
          onClick={downloadAsPDF}
          className="bg-blue-600 text-white text-xl rounded-lg shadow-lg p-3 hover:bg-blue-700 transition-all"
        >
          Download as PDF
        </button>
      </div>
      <div
        id="contentToConvert"
        className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8"
      >
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
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Importance
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Key Concepts & Practical Applications
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Week-wise Learning Objectives
                </th>
                {/* <th className="border border-gray-300 px-4 py-2 text-left">
                  Resources
                </th> */}
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
