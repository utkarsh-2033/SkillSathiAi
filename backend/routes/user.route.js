const express = require("express");
const {
  deleteusercontroller,
  logoutuserhandler,
  updateprofilecontroller,
  updateCareerDetails,
  saveQuizResult,
  getProgress,
  getLatestProgress,
  saveSkillAssessment,
  postSkillAssessmentFeedback,
  getAllProgress,
  getFilteredProgress,
  getLearningPathway,
  getSkillProficiencyAssessment,
  addReward,
  getRewards
} = require("../controllers/user.controller.js");
const verifyUser = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/updateprofile/:id", verifyUser, updateprofilecontroller);

router.delete("/deleteuser/:id", verifyUser, deleteusercontroller);

router.post("/logout", logoutuserhandler);

router.put("/career/:id", verifyUser, updateCareerDetails);

router.post("/saveQuizResult/:id", saveQuizResult);

router.get("/api/progress/:userId", getProgress);

router.get("/api/quiz-progress/:userId", getLatestProgress);

router.get("/filteredprogress/:userId", getFilteredProgress);

router.get("/allprogress/:userId", getAllProgress);

router.post("/api/save-skill-assessment/:userId", saveSkillAssessment);

router.get("/api/skill-assessment-feedback/:userId", postSkillAssessmentFeedback);

router.get("/api/learning-path-timeline/:id", getLearningPathway);

router.get('/skillassessment/:userId', getSkillProficiencyAssessment);
router.post("/add", addReward);

// Route to fetch user rewards
router.get("/:userId", getRewards);
module.exports = router;
