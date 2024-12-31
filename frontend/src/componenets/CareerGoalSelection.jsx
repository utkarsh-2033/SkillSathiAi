import React, { useState, useEffect } from "react";

const CareerGoalSelection = () => {
  const [careerGoals, setCareerGoals] = useState([]);
  const [selectedCareerGoal, setSelectedCareerGoal] = useState(null);
  const [levels, setLevels] = useState([]);
  const [level, setlevel] = useState("");
  const [sublevels, setSublevels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState({});
  const [error, setError] = useState(null);
  const [userdata, setUserdata] = useState({
    careerGoalName: "",
    levelName: "",
    subLevelName: "",
    skills: [],
  });

  // Fetch all career goals
  useEffect(() => {
    const fetchCareerGoals = async () => {
      try {
        const response = await fetch("/api/careergoals");
        const data = await response.json();
        setCareerGoals(data);
      } catch (error) {
        setError("Error fetching career goals");
      }
    };
    fetchCareerGoals();
  }, []);

  // Handle career goal selection
  const handleCareerGoalChange = async (e) => {
    const careerGoalId = e.target.value;
    setSelectedCareerGoal(careerGoalId);

    // Fetch career goal details (levels and sub-levels)
    try {
      const response = await fetch(`/api/careergoals/${careerGoalId}`);
      const data = await response.json();
      setLevels(data.levels || []); // Update levels based on the selected career goal
      setSkills([]); // Reset skills when a new career goal is selected
      setSublevels([]); // Reset sublevels
      setSelectedSkills({}); // Reset selected skills
      setUserdata((prevData) => ({
        ...prevData,
        careerGoalName: selectedCareerGoal,
      }));
    } catch (error) {
      setError("Error fetching career goal details");
    }
  };

  // Handle level selection
  const handleLevelChange = async (e) => {
    setlevel("");
    const levelName = e.target.value;
    setUserdata((prevData) => ({
      ...prevData,
      levelName: levelName,
    }));

    // Check if the level contains skills directly or if it has sublevels
    const level = levels.find((lvl) => lvl.name === levelName);
    // console.log(level);
    console.log(level.subLevels.length);
    if (level.subLevels.length > 0) {
      setlevel(levelName);
      // If there are sublevels, set them for further selection
      setSublevels(level.subLevels);
      setSkills([]); // Reset skills when switching levels
    } else {
      // If there are no sublevels, fetch skills directly for the level
      try {
        // console.log(selectedCareerGoal);
        // console.log(levelName);
        const response = await fetch(
          `/api/careergoals/${selectedCareerGoal}/levels/${levelName}`
        );
        const data = await response.json();
        // console.log(data);
        setSkills(data); // Set skills for the selected level
        setSublevels([]); // Reset sublevels
      } catch (error) {
        setError("Error fetching skills for the selected level");
      }
    }
  };

  // Handle sub-level selection
  const handleSubLevelChange = async (e) => {
    const subLevelName = e.target.value;
    setUserdata((prevData) => ({
      ...prevData,
      subLevelName: subLevelName,
    }));
    const t = level;
    // console.log(subLevelName);
    // console.log(t);
    // Fetch skills for the selected sub-level
    try {
      const response = await fetch(
        `/api/careergoals/${selectedCareerGoal}/levels/${t}/sublevels/${subLevelName}`
      );
      const data = await response.json();
      setSkills(data); // Set skills for the selected sub-level
    } catch (error) {
      setError("Error fetching skills for the selected sub-level");
    }
  };

  // Handle skill level change (Beginner, Intermediate, Advanced)
  const handleSkillChange = (skillName, field, value) => {
    setSelectedSkills((prevSkills) => {
      // Ensure prevSkills is always an array
      const updatedSkills = Array.isArray(prevSkills) ? [...prevSkills] : [];

      const skillIndex = updatedSkills.findIndex(
        (skill) => skill.name === skillName
      );

      if (skillIndex === -1) {
        updatedSkills.push({ name: skillName, [field]: value });
      } else {
        updatedSkills[skillIndex] = {
          ...updatedSkills[skillIndex],
          [field]: value,
        };
      }

      return updatedSkills;
    });
  };
  // Handle the submit
  const handleSubmit = async () => {
    
    const requestData = {
      careerGoalName: userdata.careerGoalName,
      levelName: userdata.levelName,
      subLevelName: userdata.subLevelName,
      skills: selectedSkills.map((skill) => ({
        name: skill.name,
        known: skill.known,
        level: skill.level,
      })),
    };
    console.log(requestData)

    try {
      const response = await fetch("https://fakeurl.com/submit", {
        // Replace with the actual endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      console.log("Response:", data);
      // Handle successful submission (show a message, clear form, etc.)
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle errors during submission
    }
  };

  return (
    <div className="flex flex-col">
      {/* Career Goal Dropdown */}
      <div className="flex flex-col mt-4">
        <label htmlFor="careerGoal">Select Career Goal</label>
        <select
          id="careerGoal"
          onChange={handleCareerGoalChange}
          className="bg-slate-200 border-2 border-black p-2 rounded-md"
        >
          <option value="">Select a Career Goal</option>
          {careerGoals.map((goal) => (
            <option key={goal._id} value={goal._id}>
              {goal.name}
            </option>
          ))}
        </select>
      </div>

      {/* Level Dropdown */}
      {levels.length > 0 && (
        <div className="flex flex-col mt-4">
          <label htmlFor="level">Select Level</label>
          <select
            id="level"
            onChange={handleLevelChange}
            className="bg-slate-200 border-2 border-black p-2 rounded-md"
          >
            <option value="">Select a Level</option>
            {levels.map((level) => (
              <option key={level.name} value={level.name}>
                {level.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sublevel Dropdown (only if sublevels are present) */}
      {sublevels.length > 0 && (
        <div className="flex flex-col mt-4">
          <label htmlFor="subLevel">Select Sub-Level</label>
          <select
            id="subLevel"
            onChange={handleSubLevelChange}
            data-levelName={
              levels.find((level) => level.name === selectedCareerGoal)?.name
            }
            className="bg-slate-200 border-2 border-black p-2 rounded-md"
          >
            <option value="">Select a Sub-Level</option>
            {sublevels.map((subLevel) => (
              <option key={subLevel.name} value={subLevel.name}>
                {subLevel.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Select Your Skills</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <strong>Skill</strong>
            </div>
            <div>
              <strong>Know?</strong>
            </div>
            <div>
              <strong>Level</strong>
            </div>
          </div>
          <div className="max-h-[35vh] overflow-y-auto border p-2 mt-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center justify-between mt-2"
              >
                <span>{skill}</span>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleSkillChange(skill, "known", e.target.checked)
                    }
                  />
                </div>
                <div>
                  <select
                    onChange={(e) =>
                      handleSkillChange(skill, "level", e.target.value)
                    }
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Submit
      </button>

      {/* Error Handling */}
      {error && <p className="text-red-700 text-center">{error}</p>}
    </div>
  );
};

export default CareerGoalSelection;
