import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { selectUser } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";

const socket = io("http://localhost:5000"); // Connection to the WebSocket server

const ChatRoom = () => {
  const [careerGoal, setCareerGoal] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const user = useSelector(selectUser);
  const username = user.username;
  // Career goals to be presented as predefined chat rooms
  const careerGoals = [
    "web-developer",
    "data-scientist",
    "ui-ux-designer",
    "product-manager",
    "financial-analyst",
  ];

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on("chatMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("roomJoined", (user) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: `${user} has joined the room!`, username: "System" },
      ]);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("roomJoined");
    };
  }, []);

  const handleJoinRoom = () => {
    if (careerGoal) {
      socket.emit("joinRoom", careerGoal, username); // Emit the room name and username
    }
  };

  const handleSendMessage = () => {
    if (message) {
      socket.emit("chatMessage", {
        roomName: careerGoal,
        message,
        username,
      });
      setMessage(""); // Clear message input
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Join a Career Goal Chat Room
        </h2>

        {/* Career goal selection */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Choose your Career Goal:
          </label>
          <select
            value={careerGoal}
            onChange={(e) => setCareerGoal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your career goal</option>
            {careerGoals.map((goal) => (
              <option key={goal} value={goal}>
                {goal.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleJoinRoom}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Join Room
        </button>

        {/* Chat Messages */}
        <div className="mt-6 h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Chat Messages
          </h3>
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <p className="text-sm font-semibold text-gray-600">
                  {msg.username}
                </p>
                <p className="text-gray-800">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message input */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
