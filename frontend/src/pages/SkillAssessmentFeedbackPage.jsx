import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const SkillAssessmentFeedbackPage = () => {
  const user = useSelector(selectUser);
  const [skillData, setSkillData] = useState(null);
  const [feedbackResults, setFeedbackResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    // Fetch the latest skillProficiencyAssessment data
    fetch(`/user/api/skill-assessment-feedback/${user._id}`)
      .then((response) => response.json())
      .then((data) => {
        setSkillData(data.latestAssessment); // Set the most recent assessment data
        setFeedbackResults(data.feedbackResults || []); // Set the feedback results
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching skill data:", error);
        setLoading(false);
      });
  }, [user._id]);

  const formatFeedback = (text) => {
    // Convert Markdown-like syntax to HTML
    const formattedText = text
      .replace(/##\s(.*?)(\n|$)/g, "<h2 class='text-xl font-bold mb-4'>$1</h2>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*\s(.*?)(\n|$)/g, "<li class='mb-2'>$1</li>")
      .replace(
        /(https?:\/\/[^\s]+)/g,
        `<a href='$1' target='_blank' rel='noopener noreferrer' class='text-blue-600 underline'>$1</a>`
      )
      .replace(/\n/g, "<br>");
    return formattedText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 to-blue-200 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Skill Assessment Feedback
      </h1>
      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : !skillData ? (
        <p className="text-center text-lg text-red-500">
          No skill assessment feedback available.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto mb-8">
            <table className="table-auto w-full bg-white shadow-lg rounded-lg border-separate border-spacing-0">
              <thead className="bg-gradient-to-r from-blue-500 to-green-500 text-white uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 font-bold text-left">Feedback</th>
                  <th className="py-3 px-6 font-bold text-left">Skill</th>
                  <th className="py-3 px-6 font-bold text-left">Level</th>
                  <th className="py-3 px-6 font-bold text-left">
                    Proficiency Score
                  </th>
                  <th className="py-3 px-6 font-bold text-left">Score</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {skillData.input_data.skill_name.map((skill, index) => (
                  <tr
                    className="border-b border-gray-200 hover:bg-gray-50 transition-all"
                    key={index}
                  >
                    <td className="py-3 px-6 text-left">
                      <span className="font-medium text-green-600">
                        {skillData.feedback[index]}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left font-semibold text-gray-800">
                      {skill}
                    </td>
                    <td className="py-3 px-6 text-left text-gray-600">
                      {skillData.input_data.level[index]}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {typeof skillData.predictions[index] === "number"
                        ? skillData.predictions[index].toFixed(2)
                        : "N/A"}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {skillData.input_data.score[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className=" text-center">
            <button
              onClick={() => {
                navigate("/learning-path-timeline");
              }}
              className=" mt-5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-md text-xl font-bold shadow-lg my-5 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition duration-300 transform hover:scale-105 mb-8"
            >
              Get Personalized Learning Path
            </button>
          </div>

          {/* Feedback Results Section */}
          <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Detailed Feedback Results
            </h2>
            {feedbackResults.length === 0 ? (
              <p className="text-gray-600">No additional feedback available.</p>
            ) : (
              <div className="space-y-6">
                {feedbackResults.map((feedback, index) => (
                  <div
                    key={index}
                    className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md"
                  >
                    <p className="text-gray-800 font-semibold mb-2">
                      Feedback for Skill {index + 1}:
                    </p>
                    <div
                      key={index}
                      className="mb-8 text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: formatFeedback(feedback),
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SkillAssessmentFeedbackPage;
