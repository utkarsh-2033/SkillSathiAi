const mongoose = require("mongoose");

const CareerGoalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  levels: [
    {
      name: { type: String, required: true },
      skills: [{ type: String }],  // Skills are optional
      subLevels: [
        {
          name: { type: String, required: true },
          skills: [{ type: String, required: true }]  // Skills are required in subLevels
        }
      ]
    }
  ]
});

module.exports = mongoose.model("CareerGoal", CareerGoalSchema);
