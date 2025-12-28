import React, { useEffect, useState } from "react";
import useChatStore from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";

const MessagesPage = () => {
  const { connectSocket, disconnectSocket, fetchMessages, activeConversation } =
    useChatStore();
  const { authUser: user } = useAuthStore();

  // Local state for mobile view toggle
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    }
    return () => disconnectSocket();
  }, [user, connectSocket, disconnectSocket]);

  useEffect(() => {
    if (activeConversation) {
      setShowChatOnMobile(true);
    }
  }, [activeConversation]);

  const handleSelectConversation = (conversationId) => {
    fetchMessages(conversationId);
    setShowChatOnMobile(true);
  };

  const handleBackToConversations = () => {
    setShowChatOnMobile(false);
    // optionally clear active conversation in store if we want
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar / List - Hidden on mobile if chat is open */}
      <div
        className={`w-full md:w-1/3 lg:w-[30%] h-full flex flex-col border-r border-gray-200 bg-white
                ${showChatOnMobile ? "hidden md:flex" : "flex"}
            `}
      >
        <ConversationList onSelect={handleSelectConversation} />
      </div>

      {/* Chat Window - Hidden on mobile if no chat open */}
      <div
        className={`w-full md:w-full lg:w-[70%] h-full bg-[#efeae2]
                ${showChatOnMobile ? "flex" : "hidden md:flex"}
            `}
      >
        <ChatWindow onBack={handleBackToConversations} />
      </div>
    </div>
  );
};

export default MessagesPage;
