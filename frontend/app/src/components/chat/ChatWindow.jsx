import React, { useState, useEffect, useRef } from "react";
import useChatStore from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { Send, MoreVertical, ArrowLeft } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import { toast } from "react-hot-toast";

const ChatWindow = ({ onBack }) => {
  const { activeConversation, messages, sendMessage, isLoading } =
    useChatStore();
  const { authUser: user } = useAuthStore();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!activeConversation) {
    return (
      <div className="h-full flex w-full flex-col items-center justify-center bg-[#f0f2f5] text-gray-500">
        <div className="text-center p-8">
          <h3 className="text-2xl font-light mb-2">
            Select a chat to start messaging
          </h3>
          <p>Connect with your vendors instantly.</p>
        </div>
      </div>
    );
  }

  const otherUser =
    activeConversation.participants?.find((p) => p._id !== user._id) || {};

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (newMessage.length > 2000) {
      toast.error("Message is too long (max 2000 characters)");
      return;
    }

    await sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#efeae2]">
      {}
      <div className="px-4 py-3 bg-[#f0f2f5] border-b border-gray-300 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onBack} className="md:hidden mr-2 text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <img
            src={
              otherUser.profilePic ||
              otherUser.logo ||
              "https://avatar.iran.liara.run/public"
            }
            alt={otherUser.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800">
              {otherUser.businessName || otherUser.fullName}
            </h3>
            {}
          </div>
        </div>

        <div className="flex items-center space-x-4 text-gray-600">
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#e5ddd5] opacity-90">
        {messages.map((msg, idx) => {
          const isMe = msg.sender._id === user._id || msg.sender === user._id;

          const currentDate = new Date(msg.createdAt);
          const previousMessage = messages[idx - 1];
          const previousDate = previousMessage
            ? new Date(previousMessage.createdAt)
            : null;

          let showDateSeparator = false;
          if (!previousDate) {
            showDateSeparator = true;
          } else if (
            currentDate.toDateString() !== previousDate.toDateString()
          ) {
            showDateSeparator = true;
          }

          return (
            <React.Fragment key={idx}>
              {showDateSeparator && (
                <div className="flex justify-center my-4 sticky top-2 z-10">
                  <span className="bg-[#e7ebf0]/90 text-[#54656f] text-xs px-3 py-1.5 rounded-lg shadow-sm font-medium backdrop-blur-sm">
                    {isToday(currentDate)
                      ? "Today"
                      : isYesterday(currentDate)
                        ? "Yesterday"
                        : format(currentDate, "MMMM d, yyyy")}
                  </span>
                </div>
              )}
              <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] md:max-w-[60%] rounded-lg px-3 py-1.5 shadow-sm text-sm relative group
                              ${
                                isMe
                                  ? "bg-primary-3 font-medium text-white rounded-tr-none"
                                  : "bg-orange-300 font-medium text-gray-900 rounded-tl-none"
                              }
                          `}
                >
                  <div className="break-words">
                    {DOMPurify.sanitize(msg.content, {
                      ALLOWED_TAGS: [],
                      KEEP_CONTENT: true,
                    })}
                  </div>
                  <div
                    className={`text-[10px] ${
                      isMe ? "text-white/80" : "text-gray-500"
                    } text-right mt-1 ml-4`}
                  >
                    {format(new Date(msg.createdAt), "HH:mm")}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {}
      <div className="p-3 bg-[#f0f2f5] flex items-center space-x-2">
        <form onSubmit={handleSend} className="flex-1 flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full px-4 py-2 rounded-lg border-none focus:ring-0 focus:outline-none bg-white text-gray-800"
          />
          <button
            type="submit"
            className="ml-2 text-[#54656f] p-2 hover:bg-gray-200 rounded-full"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
