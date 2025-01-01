import React from "react";

const SkillAssessmentIntro = ({ careerGoal, level, subLevel, skills, onSkillSelect }) => {
  const displayLevel = subLevel || level;

  return (
    <div>
      {/* Career Details */}
      <div className="bg-blue-100 p-4 rounded-md shadow-md mb-4">
        <h2 className="text-xl font-semibold text-gray-700 text-center">
          Career Goal: {displayLevel}
        </h2>
      </div>

      {/* Introductory Message */}
      <div className="text-center text-gray-700 mb-6">
        <p className="text-lg">
          Let's test your proficiency in your current skills and identify any skill gaps!
        </p>
      </div>

      {/* Skill Selector */}
      {skills.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {skills.map((skill) => (
            <button
              key={skill.skillName}
              className="bg-white p-4 border rounded-md shadow hover:bg-gray-100 text-gray-800 font-semibold"
              onClick={() => onSkillSelect(skill.skillName)}
            >
              {skill.skillName}
            </button>
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
