const express = require("express");
const router = express.Router();
const CareerGoal = require("../models/careerGoals.model.js");

// Fetch all career goals
router.get("/careergoals", async (req, res) => {
  try {
    const goals = await CareerGoal.find({});
    res.json(goals);
  } catch (err) {
    res.status(500).send("Error fetching career goals");
  }
});

// Fetch Career Goal with Levels and Sub-Levels
router.get('/careergoals/:id', async (req, res) => {
  try {
    const careerGoal = await CareerGoal.findById(req.params.id);
    if (!careerGoal) {
      return res.status(404).json({ message: 'Career goal not found' });
    }
    res.json(careerGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching career goal', error });
  }
});

// Fetch Skills for a Career Goal, Level, and Sub-Level
router.get('/careergoals/:careerGoalId/levels/:levelName/sublevels/:subLevelName', async (req, res) => {
  try {
    const careerGoal = await CareerGoal.findById(req.params.careerGoalId);
    if (!careerGoal) {
      return res.status(404).json({ message: 'Career goal not found' });
    }

    const level = careerGoal.levels.find(l => l.name === req.params.levelName);
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    const subLevel = level.subLevels.find(sl => sl.name === req.params.subLevelName);
    if (!subLevel) {
      return res.status(404).json({ message: 'Sub-level not found' });
    }

    res.json(subLevel.skills || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sub-level skills', error });
  }
});

// Fetch Skills for a Career Goal and Level (No Sub-Level)
router.get('/careergoals/:careerGoalId/levels/:levelName', async (req, res) => {
  try {
    const careerGoal = await CareerGoal.findById(req.params.careerGoalId);
    if (!careerGoal) {
      return res.status(404).json({ message: 'Career goal not found' });
    }
    // console.log(careerGoal);
    // console.log(req.params.levelName);
    // console.log(careerGoal.levels);
    const level = careerGoal.levels.find((l) =>l.name === req.params.levelName);
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }
    // console.log(level);

    // If the level has no sublevels, return skills directly
    const skills = level.skills;
    // console.log(skills);
    res.json(skills || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching level skills', error });
  }
});

// Fetch all levels for a Career Goal
router.get('/careergoals/:careerGoalId/levels', async (req, res) => {
  try {
    const careerGoal = await CareerGoal.findById(req.params.careerGoalId);
    if (!careerGoal) {
      return res.status(404).json({ message: 'Career goal not found' });
    }

    res.json(careerGoal.levels || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching levels', error });
  }
});

// Add a new Career Goal
// router.post('/careergoals', async (req, res) => {
//   try {
//     const newCareerGoal = new CareerGoal(req.body);
//     await newCareerGoal.save();
//     res.status(201).json(newCareerGoal);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating career goal', error });
//   }
// });

// // Update a Career Goal by ID
// router.put('/careergoals/:id', async (req, res) => {
//   try {
//     const updatedCareerGoal = await CareerGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedCareerGoal) {
//       return res.status(404).json({ message: 'Career goal not found' });
//     }
//     res.json(updatedCareerGoal);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating career goal', error });
//   }
// });

// // Delete a Career Goal by ID
// router.delete('/careergoals/:id', async (req, res) => {
//   try {
//     const deletedCareerGoal = await CareerGoal.findByIdAndDelete(req.params.id);
//     if (!deletedCareerGoal) {
//       return res.status(404).json({ message: 'Career goal not found' });
//     }
//     res.json({ message: 'Career goal deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting career goal', error });
//   }
// });

// // Add a new Level to a Career Goal
// router.post('/careergoals/:careerGoalId/levels', async (req, res) => {
//   try {
//     const careerGoal = await CareerGoal.findById(req.params.careerGoalId);
//     if (!careerGoal) {
//       return res.status(404).json({ message: 'Career goal not found' });
//     }

//     const newLevel = req.body;
//     careerGoal.levels.push(newLevel);
//     await careerGoal.save();

//     res.status(201).json(newLevel);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding level', error });
//   }
// });

// // Update a Level in a Career Goal
// router.put('/careergoals/:careerGoalId/levels/:levelName', async (req, res) => {
//   try {
//     const careerGoal = await CareerGoal.findById(req.params.careerGoalId);
//     if (!careerGoal) {
//       return res.status(404).json({ message: 'Career goal not found' });
//     }

//     const levelIndex = careerGoal.levels.findIndex(l => l.name === req.params.levelName);
//     if (levelIndex === -1) {
//       return res.status(404).json({ message: 'Level not found' });
//     }

//     careerGoal.levels[levelIndex] = req.body;
//     await careerGoal.save();

//     res.json(careerGoal.levels[levelIndex]);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating level', error });
//   }
// });

// // Delete a Level from a Career Goal
// router.delete('/careergoals/:careerGoalId/levels/:levelName', async (req, res) => {
//   try {
//     const careerGoal = await CareerGoal.findById(req.params.careerGoalId);
//     if (!careerGoal) {
//       return res.status(404).json({ message: 'Career goal not found' });
//     }

//     const levelIndex = careerGoal.levels.findIndex(l => l.name === req.params.levelName);
//     if (levelIndex === -1) {
//       return res.status(404).json({ message: 'Level not found' });
//     }

//     careerGoal.levels.splice(levelIndex, 1);
//     await careerGoal.save();

//     res.json({ message: 'Level deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting level', error });
//   }
// });

// // Add a new Sub-Level to a Level
// router.post('/careergoals/:careerGoalId/levels/:levelName/sublevels', async (req, res) => {
//   try {
//     const careerGoal = await CareerGoal.findById(req.params.careerGoalId);
//     if (!careerGoal) {
//       return res.status(404).json({ message: 'Career goal not found' });
//     }

//     const level = careerGoal.levels.find(l => l.name === req.params.levelName);
//     if (!level) {
//       return res.status(404).json({ message: 'Level not found' });
//     }

//     const newSubLevel = req.body;
//     level.subLevels.push(newSubLevel);
//     await careerGoal.save();

//     res.status(201).json(newSubLevel);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding sub-level', error });
//   }
// });

// // Update a Sub-Level in a Level
// router.put('/careergoals/:careerGoalId/levels/:levelName/sublevels/:subLevelName', async (req, res) => {
//   try {
//     const careerGoal = await CareerGoal.findById(req.params.careerGoalId);
//     if (!careerGoal) {
//       return res.status(404).json({ message: 'Career goal not found' });
//     }

//     const level = careerGoal.levels.find(l => l.name === req.params.levelName);
//     if (!level) {
//       return res.status(404).json({ message: 'Level not found' });
//     }

//     const subLevel = level.subLevels.find(sl => sl.name === req.params.subLevelName);
//     if (!subLevel) {
//       return res.status(404).json({ message: 'Sub-level not found' });
//     }

//     Object.assign(subLevel, req.body);  // Update sub-level data
//     await careerGoal.save();

//     res.json(subLevel);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating sub-level', error });
//   }
// });

// // Delete a Sub-Level from a Level
// router.delete('/careergoals/:careerGoalId/levels/:levelName/sublevels/:subLevelName', async (req, res) => {
//   try {
//     const careerGoal = await CareerGoal.findById(req.params.careerGoalId);
//     if (!careerGoal) {
//       return res.status(404).json({ message: 'Career goal not found' });
//     }

//     const level = careerGoal.levels.find(l => l.name === req.params.levelName);
//     if (!level) {
//       return res.status(404).json({ message: 'Level not found' });
//     }

//     const subLevelIndex = level.subLevels.findIndex(sl => sl.name === req.params.subLevelName);
//     if (subLevelIndex === -1) {
//       return res.status(404).json({ message: 'Sub-level not found' });
//     }

//     level.subLevels.splice(subLevelIndex, 1);
//     await careerGoal.save();

//     res.json({ message: 'Sub-level deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting sub-level', error });
//   }
// });

module.exports = router;
