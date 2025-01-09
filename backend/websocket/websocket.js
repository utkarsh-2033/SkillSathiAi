module.exports = (io) => {
  // Predefined career goal rooms
  const careerRooms = [
    "web-developer",
    "data-scientist",
    "ui-ux-designer",
    "product-manager",
    "financial-analyst",
  ];

  // Listen for incoming connections
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining a predefined room
    socket.on("joinRoom", (careerGoal,username) => {
      // Check if the room exists (based on the career goal)
      if (careerRooms.includes(careerGoal)) {
        socket.join(careerGoal); // Join the room
        console.log(`${username} joined room: ${careerGoal}`);
        // Notify the room about the new user
        io.to(careerGoal).emit("chatMessage", { message: `${username} has joined the room!` });
      } else {
        console.log(`Room with career goal '${careerGoal}' does not exist.`);
        socket.emit("chatMessage", { message: "Room does not exist." });
      }
    });

    // Handle chat messages
    socket.on("chatMessage", ({ roomName, message, username }) => {
      console.log(`Message in room ${roomName} from ${username}: ${message}`);
      io.to(roomName).emit("chatMessage", { username, message });
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
