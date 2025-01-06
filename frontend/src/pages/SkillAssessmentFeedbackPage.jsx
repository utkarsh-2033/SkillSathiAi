import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";

const SkillAssessmentFeedbackPage = () => {
  const user = useSelector(selectUser);
  const [skillData, setSkillData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest skillProficiencyAssessment data
    fetch(`/user/api/skill-assessment-feedback/${user._id}`)
      .then((response) => response.json())
      .then((data) => {
        setSkillData(data); // Set the most recent assessment data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching skill data:", error);
        setLoading(false);
      });
  }, [user._id]);

  const getFeedback = (predictedProficiencyScore, score) => {
    if (predictedProficiencyScore < 1.41662 || score < 4.0) {
      return `Needs Improvement`
    //    with predicted proficiency score ${predictedProficiencyScore} and score ${score}`;
    } else if (
      predictedProficiencyScore >= 1.41662 &&
      predictedProficiencyScore < 3.577268 &&
      score >= 4.0 &&
      score < 9.0
    ) {
      return `Moderate Proficiency`
    //    with predicted proficiency score ${predictedProficiencyScore} and score ${score}`;
    } else {
      return `Proficient`
    //    with predicted proficiency score ${predictedProficiencyScore} and score ${score}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r mx-12 mt-8"> 
    {/* //from-green-200 to-blue-200 p-6 */}
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
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-lg rounded-lg border-separate border-spacing-0">
            <thead className="bg-gradient-to-r from-blue-500 to-green-500 text-white uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 font-bold text-left">Feedback</th>
                <th className="py-3 px-6 font-bold text-left">Skill</th>
                <th className="py-3 px-6 font-bold text-left">Level</th>
                <th className="py-3 px-6 font-bold text-left">Proficiency Score</th>
                <th className="py-3 px-6 font-bold text-left">Score</th>
                {/* <th className="py-3 px-6 text-left">Tim</th> */}
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
                      {getFeedback(
                        skillData.predictions[index],
                        skillData.input_data.score[index]
                      )}
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
                  {/* <td className="py-3 px-6 text-left text-sm text-gray-500">
                    {new Date(skillData.dateTimeGiven).toLocaleString()}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SkillAssessmentFeedbackPage;