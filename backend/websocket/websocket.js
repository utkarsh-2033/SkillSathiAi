module.exports = (io) => {
  // Predefined career goal rooms
  const careerRooms = [
    "web-developer",
    "data-scientist",
    "ui-ux-designer",
    "product-manager",
    "financial-analyst",
  ];

  // Chat history to store messages for each room
  const chatHistory = {};

  // Listen for incoming connections
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining a predefined room
    socket.on("joinRoom", (careerGoal, username) => {
      if (careerRooms.includes(careerGoal)) {
        socket.join(careerGoal); // Join the room
        console.log(`${username} joined room: ${careerGoal}`);

        // Emit chat history to the new user
        if (chatHistory[careerGoal]) {
          socket.emit("chatHistory", chatHistory[careerGoal]);
        }

        // Notify the room about the new user
        io.to(careerGoal).emit("chatMessage", {
          message: `${username} has joined the room!`,
        });
      } else {
        console.log(`Room with career goal '${careerGoal}' does not exist.`);
        socket.emit("chatMessage", { message: "Room does not exist." });
      }
    });

    // Handle chat messages
    socket.on("chatMessage", ({ roomName, message, username }) => {
      console.log(`Message in room ${roomName} from ${username}: ${message}`);

      // Save chat messages in history
      if (!chatHistory[roomName]) chatHistory[roomName] = [];
      chatHistory[roomName].push({ username, message });

      // Emit message to the room
      io.to(roomName).emit("chatMessage", { username, message });
    });

    // Handle private messaging
    // socket.on("privateMessage", ({ toSocketId, message, fromUsername }) => {
    //   io.to(toSocketId).emit("privateMessage", {
    //     fromUsername,
    //     message,
    //   });
    // });

    // Handle file sharing
    socket.on("shareFile", ({ roomName, fileName, fileUrl, username }) => {
      console.log(`${username} shared a file in room ${roomName}: ${fileName}`);
      io.to(roomName).emit("shareFile", {
        username,
        fileName,
        fileUrl,
      });
    });

    // Handle room-specific topics
    socket.on("createThread", ({ roomName, topic, username }) => {
      console.log(`${username} created a thread in room ${roomName}: ${topic}`);
      io.to(roomName).emit("newThread", { topic, username });
    });

    // Notify when a user mentions someone
    socket.on(
      "mention",
      ({ roomName, mentionedUser, message, fromUsername }) => {
        console.log(
          `${fromUsername} mentioned ${mentionedUser} in room ${roomName}`
        );
        io.to(roomName).emit("mention", {
          mentionedUser,
          fromUsername,
          message,
        });
      }
    );

    // Notify when a user leaves
    socket.on("leaveRoom", ({ roomName, username }) => {
      console.log(`${username} left room: ${roomName}`);
      socket.leave(roomName);
      io.to(roomName).emit("chatMessage", {
        message: `${username} has left the room.`,
      });
    });

    // Poll Creation and Voting
    socket.on("createPoll", ({ roomName, poll }) => {
      io.to(roomName).emit("pollCreated", poll);
    });

    socket.on("votePoll", ({ roomName, pollId, option }) => {
      const poll = activePolls.find((p) => p.id === pollId);
      if (poll) {
        poll.options[option] += 1;
        io.to(roomName).emit("pollUpdated", poll);
      }
    });

    // Private Messaging
    socket.on("privateMessage", ({ recipient, message, sender }) => {
      const recipientSocket = onlineUsers[recipient];
      if (recipientSocket) {
        io.to(recipientSocket).emit("privateMessage", { message, sender });
      }
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
