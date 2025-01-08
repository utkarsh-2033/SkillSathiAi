import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CareerGoalSelection from "../componenets/CareerGoalSelection";

const CarrierGoal = () => {
  const [editmode, seteditmode] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.currentUser);

  const careerDetails = user?.careerDetails || {};
  const goal = careerDetails?.subLevel || careerDetails?.level;
  const skillsWithLevels = (careerDetails?.skills || []).filter(
    (skill) => skill.level
  );

  const handleEditMode = () => {
    seteditmode(!editmode);
  };

  return (
    <div className="p-6 w-4/5 mx-auto min-h-screen flex flex-col items-center">
      <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 font-serif tracking-wide">
        Career Overview
      </h1>

      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl border-t-4 border-indigo-600">
        {careerDetails.careerGoal && !editmode ? (
          <>
            <div className="text-center mb-10">
              <div className="flex flex-wrap justify-center gap-6">
                <div className="px-12 py-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md flex items-center">
                  <h3 className="text-3xl font-semibold text-gray-900">
                    Career Goal:
                  </h3>
                  <p className="text-2xl font-medium ml-4">{goal}</p>
                </div>
              </div>
            </div>

            {skillsWithLevels.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">
                  Skills Required for Your Goal
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {skillsWithLevels.map((skill, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg transition-transform hover:scale-105"
                    >
                      {/* bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white */}

                      <div className="text-center">
                        <span className="text-xl font-medium block font-serif">
                          {skill.skillName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-lg mt-6">
                No skills with levels selected yet. Add or update skills to
                enhance your career path.
              </p>
            )}
          </>
        ) : (
          <CareerGoalSelection />
        )}
        {user.careerDetails.skills.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleEditMode}
              className="px-10 py-4 bg-indigo-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-indigo-600 transition-all"
            >
              {!editmode ? "Edit Career Goal" : "Save"}
            </button>
          </div>
        )}
      </div>
      <div className="text-center">
        {user.careerDetails.skills.length > 0 && !editmode && (
          <button
            onClick={() => {
              navigate("/skill-assessment",{ state: { from: 'careergoal' } });
            }}
            className=" mt-5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-md text-xl font-bold shadow-lg my-5 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition duration-300 transform hover:scale-105 mb-8"
          >
            Start Skill Assessment
          </button>
        )}
      </div>
    </div>
  );
};

export default CarrierGoal;
