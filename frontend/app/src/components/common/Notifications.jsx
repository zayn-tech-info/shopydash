import React, { useEffect, useRef, useState } from "react";
import { Bell, Check, Loader2, Inbox, X } from "lucide-react";
import { useNotificationStore } from "../../store/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, isLoading } =
    useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleMarkAllRead = () => {
    markAsRead();
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const panelRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-n-2/50 transition-colors focus:outline-none"
        aria-label="Toggle notifications"
      >
        <Bell size={24} className="text-n-6 hover:text-primary-3 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-3 rounded-full min-w-[1.25rem] h-5 shadow-sm border border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex justify-end">
          <div
            className="flex-1 bg-black/25 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={panelRef}
            className="fixed top-0 right-0 h-screen w-full sm:w-[320px] md:w-[360px] lg:w-[380px] bg-white shadow-2xl border-l border-gray-100 flex flex-col animate-in slide-in-from-right fade-in duration-200 z-[9999]"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-50 bg-gray-50/60">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary-3 hover:text-primary-2 font-medium transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
                  aria-label="Close notifications"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <div className="flex justify-center items-center py-12 text-gray-400">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-gray-500 px-6">
                  <Inbox size={44} className="mb-3 text-gray-300" />
                  <p className="text-base font-medium text-gray-700">
                    No notifications yet
                  </p>
                  <p className="text-sm text-gray-500 mt-1 text-center">
                    New alerts will appear here when they arrive.
                  </p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification._id}
                      className={`hover:bg-gray-50 transition-colors relative group ${
                        !notification.readStatus ? "bg-orange-50/20" : ""
                      }`}
                    >
                      <div className="flex gap-3 p-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-0.5 truncate pr-6">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mb-1.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>

                        {!notification.readStatus && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded-full text-gray-400 hover:text-primary-3 shadow-sm border border-transparent hover:border-gray-100"
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {!notification.readStatus && (
                          <div className="absolute top-5 right-4 h-2 w-2 rounded-full bg-primary-3 group-hover:opacity-0 transition-opacity" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
