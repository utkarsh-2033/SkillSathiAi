import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { selectUser } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";

// const socket = io("http://localhost:5000"); // Connection to the WebSocket server
const socket = io(`${import.meta.env.VITE_BACKEND_URL}`); // Connection to the WebSocket server

const ChatRoom = () => {
  const [careerGoal, setCareerGoal] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [privateMessage, setPrivateMessage] = useState("");
  const [file, setFile] = useState(null);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [inchatroom, setinchatrrom] = useState(false);
  const user = useSelector(selectUser);
  const username = user.username;

  // Career goals as predefined chat rooms
  const careerGoals = [
    "web-developer",
    "data-scientist",
    "ui-ux-designer",
    "product-manager",
    "financial-analyst",
  ];

  useEffect(() => {
    // Listeners for WebSocket events
    socket.on("chatMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("mention", ({ mentionedUser, fromUsername, message }) => {
      if (mentionedUser === username) {
        alert(`You were mentioned by ${fromUsername}: ${message}`);
      }
    });

    socket.on("shareFile", ({ username, fileName, fileUrl }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: `${username} shared a file: `,
          fileName,
          fileUrl,
        },
      ]);
    });

    socket.on("newPoll", ({ pollData, username }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: `${username} created a poll: ${pollData.question}`,
          options: pollData.options,
        },
      ]);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("mention");
      socket.off("shareFile");
      socket.off("newPoll");
    };
  }, [username]);

  const handleJoinRoom = () => {
    if (careerGoal) {
      socket.emit("joinRoom", careerGoal, username);
    }
    setinchatrrom(true);
    setCareerGoal(careerGoal);
  };

  const handleExitRoom = () => {
    setinchatrrom(false);
    setCareerGoal("");
  };

  const handleSendMessage = () => {
    if (message) {
      const mentionRegex = /@(\w+)/g;
      const mentionedUser = message.match(mentionRegex)?.[0]?.slice(1); // Extract username after '@'

      if (mentionedUser) {
        socket.emit("mention", {
          roomName: careerGoal,
          mentionedUser,
          message,
          fromUsername: username,
        });
      } else {
        socket.emit("chatMessage", {
          roomName: careerGoal,
          message,
          username,
        });
      }
      setMessage("");
    }
  };

  const handlePrivateMessage = () => {
    if (privateMessage) {
      const [toUsername, ...msg] = privateMessage.split(":");
      socket.emit("privateMessage", {
        toSocketId: toUsername.trim(),
        message: msg.join(":").trim(),
        fromUsername: username,
      });
      setPrivateMessage("");
    }
  };

  const handleFileUpload = () => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      socket.emit("shareFile", {
        roomName: careerGoal,
        fileName: file.name,
        fileUrl,
        username,
      });
      setFile(null);
    }
  };

  const handleCreatePoll = () => {
    if (pollQuestion && pollOptions.every((opt) => opt)) {
      socket.emit("createPoll", {
        roomName: careerGoal,
        pollData: { question: pollQuestion, options: pollOptions },
        username,
      });
      setPollQuestion("");
      setPollOptions(["", ""]);
    }
  };

  const updatePollOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        {!inchatroom && (
          <div>
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
          </div>
        )}

        {inchatroom && (
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col flex-1 ">
              {/* Chat Messages */}
              <h3 className="text-xl uppercase p-8 bg-slate-600 rounded-md text-center font-bold text-yellow-400 mt-4 mb-8">
                {careerGoal}
              </h3>
              <div className="mt-6 h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-inner">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Chat Messages
                </h3>
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div key={index} className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-600">
                        {msg.username || "System"}
                      </p>
                      <p className="text-gray-800">
                        {msg.message}{" "}
                        {msg.fileName && (
                          <a
                            href={msg.fileUrl}
                            download
                            className="text-blue-500"
                          >
                            {msg.fileName}
                          </a>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message input */}
              <div className="flex flex-col">
                <div className=" mt-4  items-center space-x-2">
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
                  <div>
                    <button
                      onClick={handleExitRoom}
                      className="w-full bg-purple-500 text-white mt-2 p-2 rounded-lg hover:bg-purple-600 transition"
                    >
                      Exit Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1">
              {/* Private messaging */}
              <div className="mt-4">
                <input
                  type="text"
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Send private message (format: username:message)"
                />
                <button
                  onClick={handlePrivateMessage}
                  className="w-full bg-green-500 text-white p-2 mt-2 rounded-lg hover:bg-green-600 transition"
                >
                  Send Private Message
                </button>
              </div>

              {/* File sharing */}
              <div className="mt-4">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleFileUpload}
                  className="w-full bg-yellow-500 text-white p-2 mt-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Share File
                </button>
              </div>

              {/* Poll creation */}
              <div className="mt-4">
                <h4 className="text-gray-700 font-medium mb-2">
                  Create a Poll:
                </h4>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Poll question"
                />
                {pollOptions.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
                <button
                  onClick={() => setPollOptions([...pollOptions, ""])}
                  className="w-full bg-gray-300 text-gray-700 p-2 mt-2 rounded-lg"
                >
                  Add Option
                </button>
                <button
                  onClick={handleCreatePoll}
                  className="w-full bg-purple-500 text-white p-2 mt-2 rounded-lg hover:bg-purple-600 transition"
                >
                  Create Poll
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
