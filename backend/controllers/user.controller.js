const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");

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

 const logoutuserhandler=(req,res,next)=>{
    {res.clearCookie("access_token");
    res.status(200).json({success:true,message:"user logged out"});}
}

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
    res.status(200).json({ message: "Career details updated successfully", user:rest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update career details" });
  }
};

const saveQuizResult = async(req, res) => {
  try {
    const id=req.params.id;
    // console.log("reached here");
    // console.log(req.body);
    const { userId, skillName, level, score, timeTaken, isPassed } = req.body;

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
      dateTimeGiven: new Date(),
      isPassed,
    };

    user.progress.push(newProgress); // Add new progress entry
    await user.save();

    res.status(200).json({ message: "Quiz result saved successfully", progress: user.progress });
  } catch (error) {
    res.status(500).json({ message: "Error saving quiz result", error: error.message });
  }
};

const getProgress=async (req, res) => {
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
}

module.exports = {
  logoutuserhandler,
  deleteusercontroller,
  updateprofilecontroller,
  updateCareerDetails,
  saveQuizResult,
  getProgress
};
