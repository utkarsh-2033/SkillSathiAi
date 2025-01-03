import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const CarrierGoal = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.currentUser);


  // Safely access career details and filter skills
  const careerDetails = user?.careerDetails || {};
  const skillsWithLevels = (careerDetails?.skills || []).filter((skill) => skill.level);


  const handleNavigateToProfile = () => {
    navigate("/profile"); // Replace with your profile page route
  };


  return (
    <div className="p-6 w-4/5 mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Career Overview</h1>


      <div className="bg-white p-8 rounded-md shadow-md hover:shadow-lg transition-shadow">
        {careerDetails.careerGoal ? (
          <>
            <h2 className="text-4xl font-semibold text-violet-900 mb-4">Your Career Path</h2>
            <p className="text-gray-700 mb-4">
              <span className="font-bold lg:text-2xl">Career Goal:</span>
              <span className="lg:text-2xl text-pink-700"> {careerDetails.careerGoal}</span>
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-bold lg:text-2xl">Level:</span>
              <span className="lg:text-2xl text-pink-700"> {careerDetails.level || "Not specified"}</span>
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-bold lg:text-2xl">Sub-Level:</span>
              <span className="lg:text-2xl text-pink-700"> {careerDetails.subLevel || "Not specified"}</span>
            </p>


            {skillsWithLevels.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-violet-800 mb-4">Skills Required For Your Goal:</h3>
                <div className="flex flex-wrap gap-6 justify-center ">
                  {skillsWithLevels.map((skill, index) => (
                    <div
                      key={index}
                      className="w-40 h-40 bg-gray-50 flex items-center justify-center text-center shadow-xl border border-gray-400 text-gray-700 font-medium p-4 rounded-lg transform transition-transform duration-200 hover:scale-105 hover:bg-slate-50"
                    >
                      <span className="text-2xl font-bold text-gray-800">{skill.skillName}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-lg mt-6">
                No skills with levels selected yet. Add or update skills to enhance your career path.
              </p>
            )}


            <div className="flex justify-center mt-6">
              <button
                onClick={handleNavigateToProfile}
                className="px-8 py-4 bg-violet-800 text-2xl text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors"
              >
                Edit Career
              </button>
            </div>
          </>
        ) : (
          <div className="text-center ">
            <p className="text-gray-700 text-lg font-medium mb-4">
              You haven't chosen a career path yet.
            </p>
            <button
              onClick={handleNavigateToProfile}
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
            >
              Choose Career Path
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default CarrierGoal;



