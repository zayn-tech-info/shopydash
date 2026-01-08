import React, { useRef, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="relative p-2 rounded-full hover:bg-n-2/50 transition-colors focus:outline-none">
          <Bell
            size={24}
            className="text-n-6 hover:text-primary-3 transition-colors"
          />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-3 rounded-full min-w-[1.25rem] h-5 shadow-sm border border-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-[100] w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          sideOffset={5}
          align="end"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary-3 hover:text-primary-2 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="flex justify-center items-center py-8 text-gray-400">
                <Loader2 className="animate-spin mr-2" size={20} />
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors relative group ${
                      !notification.readStatus ? "bg-orange-50/30" : ""
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

          <div className="p-2 border-t border-gray-50 bg-gray-50/50 text-center">
            <Link
              to="/notifications"
              className="text-xs text-gray-500 hover:text-gray-900 font-medium"
            >
              View all history
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Notifications;
