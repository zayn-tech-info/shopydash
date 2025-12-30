import { Plus, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import useChatStore from "../store/chatStore";
import { useEffect } from "react";

export const VendorFloatingButton = () => {
  const { authUser } = useAuthStore();
  const { conversations, fetchConversations } = useChatStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      fetchConversations();
    }
  }, [authUser, fetchConversations]);

  const unreadMessageCount = conversations.reduce((acc, conv) => {
    const count = conv.unreadCounts?.[authUser?._id] || 0;
    return acc + count;
  }, 0);

  if (!authUser) return null;
  // Don't show on specific pages if needed, but user requested "blank" (just icons) messages globally
  // The original code hid it on /vendor/add. I'll keep that for the PLUS button part maybe?
  // But for messages it should probably be visible?
  // The user basically wants a persistent FAB.
  // I'll keep it simple: Show always for now, maybe hide on /messages?
  if (location.pathname === "/messages") return null;

  const isVendor = authUser.role === "vendor";

  const handlePostClick = () => {
    if (authUser.hasProfile) {
      if (location.pathname !== "/vendor/add") {
        navigate("/vendor/add");
      }
    } else {
      navigate("/create-vendor-profile");
    }
  };

  const handleMessageClick = () => {
    navigate("/messages");
  };

  return (
    <div className="fixed bottom-24 right-4 md:bottom-10 md:right-10 z-50 flex flex-col items-center gap-3">
      <div
        className={`flex flex-col items-center bg-[#F7561B] shadow-lg overflow-hidden ${
          isVendor ? "rounded-full p-1 gap-1" : "rounded-full"
        }`}
      >
        {isVendor && location.pathname !== "/vendor/add" && (
          <button
            onClick={handlePostClick}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
            title="Create Post"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        )}

        {isVendor && location.pathname !== "/vendor/add" && (
          <div className="w-8 h-[1px] bg-white/20" />
        )}

        <button
          onClick={handleMessageClick}
          className={`flex items-center justify-center text-white hover:bg-white/10 transition-colors relative ${
            isVendor ? "w-12 h-12 rounded-full" : "w-14 h-14"
          }`}
          title="Messages"
        >
          <MessageSquare size={isVendor ? 24 : 28} strokeWidth={2.5} />
          {unreadMessageCount > 0 && (
            <span className="absolute top-2 right-2 md:top-3 md:right-3 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-[#F7561B]">
              {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
