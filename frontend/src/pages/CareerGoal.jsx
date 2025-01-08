import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const CarrierGoal = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.currentUser);


  // Safely access career details and filter skills
  const careerDetails = user?.careerDetails || {};
  const goal=careerDetails?.subLevel || careerDetails?.level;
  const skillsWithLevels = (careerDetails?.skills || []).filter((skill) => skill.level);


  const handleNavigateToProfile = () => {
    navigate("/profile"); // Replace with your profile page route
  };


  return (
    <div className="p-6 w-4/5 flex flex-col justify-center mx-auto  min-h-screen">
      <h1 className="text-center text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3 font-serif">
        Carrer Overview
      </h1>


      <div className="bg-white p-8 rounded-md shadow-md hover:shadow-lg transition-shadow">
        {careerDetails.careerGoal ? (
          <>
            <div className="text-center mb-8">
             
              <div className="flex flex-col items-center gap-6">
               
                <div className="flex flex-wrap justify-center gap-4">
                  <div className=" flex flex-row gap-6 px-12 items-center justify-center  py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md">
                    <h3 className="text-3xl font-bold text-black">Career Goal -</h3>
                    <p className="text-2xl font-semibold ">{goal}</p>
                  </div>
                  {/* <div className="w-48 p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md">
                    <h3 className="text-3xl font-semibold">Sub-Level</h3>
                    <p className="text-2xl font-bold mt-2">{careerDetails?.subLevel || "Not specified"}</p>
                  </div> */}
                </div>
              </div>
            </div>


            {skillsWithLevels.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-2xl font-serif font-bold text-violet-800 mb-4">Skills Required For Your Goal:</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {skillsWithLevels.map((skill, index) => (
                    <div
                      key={index}
                      className="relative p-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg transform transition-transform hover:scale-105"
                    >
                      <div className="text-center">
                        <span className="text-2xl font-bold block font-serif">{skill.skillName}</span>
                      </div>
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
                className="px-12 py-4 bg-violet-800 text-md sm:text-xl text-white font-bold rounded-full shadow-lg hover:bg-violet-700 hover:shadow-2xl transition-all"
              >
                Edit Career
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 text-md font-medium mb-4">
              You haven't chosen a carier path yet.
            </p>
            <button
              onClick={handleNavigateToProfile}
              className="px-6 py-3 bg-green-500 text-xl text-white font-bold rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transition-all"
            >
              Choose Carier Path
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default CarrierGoal;



