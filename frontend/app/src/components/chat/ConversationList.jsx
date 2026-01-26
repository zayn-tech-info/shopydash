import React, { useEffect } from "react";
import useChatStore from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ConversationList = ({ onSelect }) => {
  const {
    conversations,
    fetchConversations,
    activeConversation,
    isLoading,
    fetchAvailableVendors,
    availableVendors,
    checkAccess,
    addConversation, 
  } = useChatStore();
  const { authUser: user } = useAuthStore();
  const [isNewChat, setIsNewChat] = React.useState(false);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (isNewChat) {
      fetchAvailableVendors();
    }
  }, [isNewChat, fetchAvailableVendors]);

  const getOtherParticipant = (participants) => {
    if (!user) return {};
    return participants.find((p) => p._id !== user._id) || {};
  };

  const handleStartChat = async (recipientId) => {
    const access = await checkAccess(recipientId);
    if (access.allowed && access.conversation) {
      addConversation(access.conversation); 
      onSelect(access.conversation._id);
      setIsNewChat(false);
      
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          {isNewChat ? "New Chat" : "Messages"}
        </h2>
        <button
          onClick={() => setIsNewChat(!isNewChat)}
          className="text-primary-3 hover:text-primary-2 text-sm font-medium"
        >
          {isNewChat ? "Cancel" : "New Chat"}
        </button>
      </div>

      {}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={isNewChat ? "Search vendors..." : "Search messages..."}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85C3C]"
          />
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto">
        {isNewChat ? (
          
          <div className="space-y-1">
            {availableVendors.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No available vendors found in your school.
              </div>
            ) : (
              availableVendors.map((vendor) => (
                <div
                  key={vendor._id}
                  onClick={() => handleStartChat(vendor._id)}
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        vendor.profilePic ||
                        "https:
                      }
                      alt={vendor.businessName || vendor.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                  </div>
                  <div className="ml-3 flex-1 min-w-0 border-b border-gray-100 pb-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {vendor.businessName || vendor.fullName}
                      </h3>
                      <span className="text-xs text-primary-3 font-medium px-2 py-0.5 bg-orange-50 rounded-full">
                        {vendor.subscriptionPlan}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      Click to start chatting
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          
          <>
            {isLoading && conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Loading chats...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No messages yet.
              </div>
            ) : (
              conversations.map((conv) => {
                const otherUser = getOtherParticipant(conv.participants);
                const isActive = activeConversation?._id === conv._id;
                const lastMsg = conv.lastMessage;

                return (
                  <div
                    key={conv._id}
                    onClick={() => onSelect(conv._id)}
                    className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isActive ? "bg-orange-50" : ""
                    }`}
                  >
                    {}
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          otherUser.profilePic ||
                          otherUser.logo ||
                          "https:
                        }
                        alt={otherUser.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                      />
                    </div>

                    {}
                    <div className="ml-3 flex-1 min-w-0 border-b border-gray-100 pb-3">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {otherUser.businessName || otherUser.fullName}
                        </h3>
                        {lastMsg && (
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatDistanceToNow(new Date(lastMsg.createdAt), {
                              addSuffix: false,
                            }).replace("about ", "")}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p
                          className={`text-sm truncate pr-2 ${
                            (conv.unreadCounts?.[user?._id] || 0) > 0
                              ? "text-gray-900 font-semibold"
                              : "text-gray-500"
                          }`}
                        >
                          {lastMsg ? lastMsg.content : "Start a conversation"}
                        </p>
                        {(conv.unreadCounts?.[user?._id] || 0) > 0 && (
                          <span className="flex-shrink-0 bg-primary-3 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                            {conv.unreadCounts[user._id]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
