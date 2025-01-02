import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import SkillAssessmentIntro from "../componenets/skillAssessment/SkillAssessmentIntro";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SkillAssessmentPage = () => {
  const user = useSelector(selectUser);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  const { careerGoal, level, subLevel, skills } = user.careerDetails || {};
  console.log(user.careerDetails);
  console.log(level);

  // Filter "known" skills
  const knownSkills = skills.filter((skill) => skill.known);

  const handleSkillSelect = (skillName, quizLevel) => {
    setSelectedSkill(skillName);
    // console.log(`Skill selected for quiz: ${skillName}`);

    // Navigating to the quiz page with query parameters
    navigate(`/quiz/${skillName}?level=${quizLevel}`);
  };
  const handleNavigateToSkillGap = () => {
    // Navigating to the new page for skill gap identification
    navigate("/skill-gap-identification");
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-blue-600 text-white p-4 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-center">
          Skill Assessment Quiz
        </h1>
      </header>

      <SkillAssessmentIntro
        careerGoal={careerGoal}
        level={level}
        subLevel={subLevel}
        skills={knownSkills}
        onSkillSelect={handleSkillSelect}
      />
      <div className="mt-6 flex justify-center gap-6">
        {/* Button to navigate to Skill Gap Identification */}
        <button
          onClick={handleNavigateToSkillGap}
          className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-all"
        >
          View Today's Quiz Results
        </button>
      </div>
    </div>
  );
};

export default SkillAssessmentPage;
