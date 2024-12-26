

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  careerGoal: { type: String, required: true },
  skills: [String],  // List of skills the user knows
  progress: {
    quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  },
});

module.exports = mongoose.model('User', userSchema);
