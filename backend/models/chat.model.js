const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  careerGoal: { type: String, required: true },  // Career goal as the identifier for chat rooms
  messages: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Reference to User model
      content: { type: String, required: true },  // Message content
      timestamp: { type: Date, default: Date.now },  // Timestamp for when the message was sent
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
