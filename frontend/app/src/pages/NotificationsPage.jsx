import React, { useEffect } from "react";
import { useNotificationStore } from "../store/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Loader2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const { notifications, fetchNotifications, markAsRead, isLoading } =
    useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleMarkAllRead = () => {
    markAsRead();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-primary-3 hover:text-primary-2 transition-colors px-4 py-2 rounded-lg hover:bg-orange-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {isLoading && notifications.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[400px] text-gray-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[400px] text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="opacity-40" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No notifications yet
            </h3>
            <p className="text-gray-500">
              When you get orders or updates, they'll show up here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`group relative hover:bg-gray-50 transition-colors p-6 ${
                  !notification.readStatus ? "bg-orange-50/30" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === "order:new"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {notification.type === "order:new" ? (
                      <span className="text-lg">🛍️</span>
                    ) : (
                      <Bell size={18} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-3">
                      {notification.message}
                    </p>

                    {notification.metadata?.link && (
                      <Link
                        to={notification.metadata.link}
                        className="inline-flex items-center text-sm font-medium text-primary-3 hover:text-primary-2 transition-colors"
                      >
                        View details
                      </Link>
                    )}
                  </div>

                  {!notification.readStatus && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 bg-white rounded-full text-gray-400 hover:text-primary-3 shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                      <div className="w-2 h-2 rounded-full bg-primary-3 group-hover:opacity-0 transition-opacity" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
