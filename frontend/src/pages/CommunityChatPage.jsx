import React from "react";
import ChatForum from "../componenets/chat/ChatForum"; 
import { selectUser } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";

const ChatForumPage = () => {
 const user=useSelector(selectUser);
  const careerGoal = user.careerDetails.careerGoal;
  const userId=user._id;

  return (
    <div className="m-auto my-4 md:w-1/2">
      {/* Display ChatForum with props */}
      <ChatForum careerGoal={careerGoal} userId={userId} />
    </div>
  );
};

export default ChatForumPage;
