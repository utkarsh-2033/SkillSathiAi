const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const { spawn } = require("child_process");

const updateprofilecontroller = async (req, res, next) => {
  const userId = req.params.id;

  if (req.user.userId !== userId) {
    return res.status(403).json({ success: false, message: "unauthorized" });
  }

  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.name,
          email: req.body.email,
          password: req.body.password,
          photo: req.body.photo,
        },
      },
      { new: true }
    );
    if (updatedUser) {
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json({ success: true, user: rest });
    } else {
      res.status(404).json({ success: false, message: "user not found" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteusercontroller = async (req, res, next) => {
  const userId = req.params.id;
  // console.log(userId);
  // console.log(req.user.userId);
  if (req.user.userId !== userId) {
    return res.status(403).json({ success: false, message: "unauthorized" });
  }
  try {
    await User.findByIdAndDelete(userId);
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "user deleted" });
  } catch (error) {
    next(error);
  }
};

const logoutuserhandler = (req, res, next) => {
  {
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "user logged out" });
  }
};

const updateCareerDetails = async (req, res) => {
  const userId = req.params.id;

  if (req.user.userId !== userId) {
    return res.status(403).json({ success: false, message: "unauthorized" });
  }
  const { careerGoal, level, subLevel, skills } = req.body;
  // console.log(req.body);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.careerDetails = {
      careerGoal,
      level,
      subLevel,
      skills,
    };

    await user.save();
    const { password, ...rest } = user._doc;
    res
      .status(200)
      .json({ message: "Career details updated successfully", user: rest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update career details" });
  }
};

const saveQuizResult = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("reached here");
    // console.log(req.body);
    const {
      userId,
      skillName,
      level,
      score,
      timeTaken,
      isPassed,
      avgDifficulty,
    } = req.body;

    // Find the user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update progress
    const newProgress = {
      skillName,
      level,
      testScore: score,
      timeTaken,
      avgDifficulty,
      dateTimeGiven: new Date(),
      isPassed,
    };

    user.progress.push(newProgress); // Add new progress entry
    await user.save();

    res.status(200).json({
      message: "Quiz result saved successfully",
      progress: user.progress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving quiz result", error: error.message });
  }
};

const getProgress = async (req, res) => {
  try {
    let { userId } = req.params;
    userId = userId.trim();
    // console.log(userId)

    // Find user and return only the progress field
    const user = await User.findById(userId, "progress");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Convert progress array to an easier-to-consume format
    const progressMap = {};
    user.progress.forEach(({ skillName, level }) => {
      if (!progressMap[skillName]) {
        progressMap[skillName] = {};
      }
      progressMap[skillName][level] = true; // Mark level as completed
    });
    return res.status(200).json(progressMap);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLatestProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get current time and calculate time for 24 hours ago
    const currentTime = new Date();
    const time24HoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // 24 hours ago

    // Query to get the user's progress entries from the last 24 hours
    const userProgress = await User.findOne({
      _id: userId, // Find by user ID
      "progress.dateTimeGiven": { $gte: time24HoursAgo },
    })
      .select("progress") // Only select the 'progress' field
      .lean(); // Return plain JavaScript objects instead of Mongoose documents

    if (!userProgress || !userProgress.progress.length) {
      return res
        .status(404)
        .json({ message: "No quiz progress found in the last 24 hours." });
    }

    // Filter progress entries taken within the last 24 hours
    const filteredProgress = userProgress.progress.filter((progressItem) => {
      return new Date(progressItem.dateTimeGiven) >= time24HoursAgo;
    });

    // Group by skillName and level, and pick the latest entry for each group
    const latestProgress = filteredProgress.reduce((acc, progressItem) => {
      const key = `${progressItem.skillName}-${progressItem.level}`; // Group by skill and level
      if (
        !acc[key] ||
        new Date(progressItem.dateTimeGiven) > new Date(acc[key].dateTimeGiven)
      ) {
        acc[key] = progressItem; // Keep the latest entry for this skill and level
      }
      return acc;
    }, {});

    // Convert the object into an array of progress items
    const finalProgress = Object.values(latestProgress);

    // Return the filtered progress as the response
    // console.log(finalProgress);
    res.status(200).json(finalProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getFeedback = (predictedProficiencyScore, score) => {
  if (predictedProficiencyScore < 1.41662 || score < 4.0) {
    return "Needs Improvement";
  } else if (
    predictedProficiencyScore >= 1.41662 &&
    predictedProficiencyScore < 3.577268 &&
    score >= 4.0 &&
    score < 9.0
  ) {
    return "Moderate Proficiency";
  } else {
    return "Proficient";
  }
};

const saveSkillAssessment = async (req, res) => {
  const { userId } = req.params;
  const skillAssessment = req.body;
  // Add feedback property to each prediction
  const feedback = skillAssessment.predictions.map(
    (predictedProficiencyScore, index) => {
      const score = skillAssessment.input_data.score[index];
      return getFeedback(predictedProficiencyScore, score);
    }
  );
  const updatedresult = {
    ...skillAssessment,
    feedback: feedback,
    dateTimeGiven: new Date(),
  };
// console.log(updatedresult)
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.skillProficiencyAssessment.push(updatedresult);
    await user.save();

    res
      .status(200)
      .json({ message: "Skill proficiency assessment saved successfully." });
  } catch (error) {
    console.error("Error saving skill assessment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user progress filtered by the latest test date
const getFilteredProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user and their progress
    const user = await User.findById(userId, "progress");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter the latest progress per skill
    const latestProgressMap = {};
    user.progress.forEach((entry) => {
      const skill = entry.skillName;
      if (
        !latestProgressMap[skill] ||
        new Date(entry.dateTimeGiven) >
          new Date(latestProgressMap[skill].dateTimeGiven)
      ) {
        latestProgressMap[skill] = entry;
      }
    });
    // Transform the filtered progress map into an array
    const filteredProgress = Object.values(latestProgressMap);

    res.status(200).json(filteredProgress);
  } catch (error) {
    console.error("Error fetching filtered progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    // Fetch user and their progress
    const user = await User.findById(userId, "progress");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return all progress records
    res.status(200).json(user.progress);
  } catch (error) {
    console.error("Error fetching all progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const postSkillAssessmentFeedback = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (
      !user ||
      !user.skillProficiencyAssessment ||
      user.skillProficiencyAssessment.length === 0
    ) {
      return res
        .status(404)
        .json({ message: "No skill assessment data found for this user." });
    }

    const latestAssessment = user.skillProficiencyAssessment.sort((a, b) => {
      return new Date(b.dateTimeGiven) - new Date(a.dateTimeGiven);
    })[0];

    // Prepare arguments for the Python script
    const args = latestAssessment.input_data.skill_name.map((skill, index) => {
      return [
        latestAssessment.input_data.skill_name[index],
        latestAssessment.input_data.level[index],
        latestAssessment.predictions[index],
        latestAssessment.input_data.score[index],
        latestAssessment.feedback[index],
        
      ];
    });

    // Loop through each skill quiz and call the Python script
    const feedbackPromises = args.map((argArray) => {
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", [
          "../backend/MLmodel/detailedfeedback.py",
          ...argArray,
        ]);

        let output = "";
        let errorOutput = "";

        pythonProcess.stdout.on("data", (data) => {
          output += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            resolve(output);
          } else {
            reject(
              new Error(
                `Python process exited with code ${code}: ${errorOutput}`
              )
            );
          }
        });
      });
    });

    const feedbackResults = await Promise.all(feedbackPromises);
    // console.log(latestAssessment)
    // console.log(feedbackResults)
    res.status(200).json({ latestAssessment, feedbackResults });
  } catch (error) {
    console.error("Error fetching skill assessment feedback:", error);
    res.status(500).json({
      message: "Server error while fetching skill assessment feedback.",
    });
  }
};

const getLearningPathway = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    console.log(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }

    const careerGoal =
      user.careerDetails.subLevel && user.careerDetails.subLevel.trim() !== ""
        ? user.careerDetails.subLevel
        : user.careerDetails.level;

    // Convert skills array to comma-separated string
    const skills = user.careerDetails.skills
      .map((skill) => skill.skillName)
      .join(",");
    // console.log(skills)
    // console.log(skills.split(','))
    // Prepare arguments for the Python script
    const args = [careerGoal, skills];

    // Call the Python script
    const getPathwayFeedback = new Promise((resolve, reject) => {
      const pythonProcess = spawn("python", [
        "../backend/RecommendationModel/learningpath.py",
        ...args,
      ]);

      let output = "";
      let errorOutput = "";

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(
            new Error(`Python process exited with code ${code}: ${errorOutput}`)
          );
        }
      });
    });

    const learningPathFeedback = await getPathwayFeedback;
    console.log(learningPathFeedback);
    res
      .status(200)
      .json({ careerGoal, skills: skills.split(","), learningPathFeedback });
  } catch (error) {
    console.error("Error fetching learning path:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching learning path." });
  }
};

module.exports = {
  logoutuserhandler,
  deleteusercontroller,
  updateprofilecontroller,
  updateCareerDetails,
  saveQuizResult,
  getProgress,
  getLatestProgress,
  saveSkillAssessment,
  postSkillAssessmentFeedback,
  getLearningPathway,
  getAllProgress,
  getFilteredProgress,
};
