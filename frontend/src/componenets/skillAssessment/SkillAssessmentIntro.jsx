import React, { useState } from "react";
import { useEffect } from "react";
import { selectUser } from "../../redux/slices/userSlice";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const SkillAssessmentIntro = ({
  careerGoal,
  level,
  subLevel,
  knownskills,
  skills,
  onSkillSelect,
}) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [progress, setProgress] = useState({});
  const user = useSelector(selectUser);
  const userId=user._id;
  const location=useLocation();
  // Function to fetch progress data
  const list=location.state?.from==='careergoal'? knownskills:skills;
  
  const fetchUserProgress = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/api/progress/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch progress data");
      }
      const data = await response.json();
      return data; // Progress map (skillName -> level -> true/false)
    } catch (error) {
      console.error("Error fetching progress:", error);
      return {}; // Default empty progress
    }
  };

  // Load progress data on component mount
  useEffect(() => {
    const loadProgress = async () => {
      const progressData = await fetchUserProgress(userId);
      setProgress(progressData);
    };
    loadProgress();
  }, [userId]);

  const handleSkillClick = (skillName) => {
    // Toggle the selected skill: if already selected, close the level options
    setSelectedSkill((prev) => (prev === skillName ? null : skillName));
  };

  const handleLevelClick = (skillName, level) => {
    onSkillSelect(skillName, level); // Trigger onSkillSelect with both skill and level
    setSelectedSkill(null); // Close level options after selection
  };

  return (
    <div>
      {/* Career Details */}
      <div className="bg-blue-100 p-4 rounded-md shadow-md mt-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-700 text-center">
          Career Goal: {subLevel || level}
        </h2>
      </div>

      {/* Introductory Message */}
      <div className="text-center text-gray-700 mb-6">
        <p className="text-lg text-green-800 font-semibold">
          Let's test your proficiency in your current skills and identify any
          skill gaps!
        </p>
      </div>

      {/* Skill Selector */}
      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {list.map((skill) => (
            <div key={skill.skillName} className="relative">
              <button
                className="bg-white p-4 border rounded-md w-full shadow hover:bg-gray-100 text-gray-800 font-semibold"
                onClick={() => handleSkillClick(skill.skillName)} // Toggle level options
              >
                {skill.skillName}
              </button>

              {/* Level options visible if the skill is selected */}
              {selectedSkill === skill.skillName && (
                <div className="absolute mt-2 w-full bg-white shadow-lg rounded-md z-10 p-4">
                  <p className="text-gray-600 text-center mb-4">
                    Select Skill Level:
                  </p>
                  {["Easy", "Intermediate", "Advanced"].map((level) => {
                    const isCompleted =
                      progress[skill.skillName]?.[level.toLowerCase()] || false;

                    return (
                      <button
                        key={level}
                        className={`block w-full text-center py-2 px-4 rounded-md mb-2 ${
                          isCompleted
                            ? "bg-green-500 hover:bg-green-600 text-white" // Highlight completed levels
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        onClick={() =>
                          handleLevelClick(skill.skillName, level.toLowerCase())
                        }
                      >
                        {level}
                        {isCompleted && (
                          <span className="ml-2">✔️</span> // Checkmark
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No skills available for assessment. Add skills to your profile to get
          started.
        </p>
      )}
    </div>
  );
};

export default SkillAssessmentIntro;
