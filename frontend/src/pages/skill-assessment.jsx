import React from 'react'
import { useState } from 'react';
import QuizComponent from '../componenets/QuizComponent'

const skillAssessment = () => {
    const [careerGoal, setCareerGoal] = useState('Web Developer'); // Default career goal

    // Function to handle career goal selection
    const handleCareerGoalChange = (event) => {
      setCareerGoal(event.target.value);
    };
  
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <header className="bg-blue-600 text-white p-4 rounded-md shadow-md">
          <h1 className="text-3xl font-bold text-center">Skill Assessment Quiz</h1>
        </header>
  
        <div className="mt-6 text-center">
          <label className="text-lg text-gray-700">Select your career goal:</label>
          <select
            value={careerGoal}
            onChange={handleCareerGoalChange}
            className="mt-2 p-2 border border-gray-300 rounded-md"
          >
            <option value="Web Developer">Web Developer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
            <option value="UX/UI Designer">UX/UI Designer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
          </select>
        </div>
  
        <QuizComponent careerGoal={careerGoal} />
      </div>
    );
}

export default skillAssessment;
