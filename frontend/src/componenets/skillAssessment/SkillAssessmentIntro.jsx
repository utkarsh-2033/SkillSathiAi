import React, { useState } from "react";

const SkillAssessmentIntro = ({ careerGoal, level, subLevel, skills, onSkillSelect }) => {
  const [selectedSkill, setSelectedSkill] = useState(null); // Track which skill is clicked

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
          Let's test your proficiency in your current skills and identify any skill gaps!
        </p>
      </div>

      {/* Skill Selector */}
      {skills.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {skills.map((skill) => (
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
                  <p className="text-gray-600 text-center mb-4">Select Skill Level:</p>
                  {["Easy", "Intermediate", "Advanced"].map((levelOption) => (
                    <button
                      key={levelOption}
                      className="block w-full text-center text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md mb-2"
                      onClick={() => handleLevelClick(skill.skillName, levelOption.toLowerCase())} // Pass skill and level to onSkillSelect
                    >
                      {levelOption}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No skills available for assessment. Add skills to your profile to get started.
        </p>
      )}
    </div>
  );
};

export default SkillAssessmentIntro;
