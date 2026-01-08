import { create } from "zustand";
import { api } from "../lib/axios";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/api/v1/notifications");
      set({
        notifications: res.data.data,
        unreadCount: res.data.meta.unreadCount,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      set({ isLoading: false });
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: async (notificationId = null) => {
    try {
      await api.patch("/api/v1/notifications/read", { notificationId });
      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          !notificationId || n._id === notificationId
            ? { ...n, readStatus: true }
            : n
        );

        const newUnreadCount = notificationId ? state.unreadCount - 1 : 0;

        return {
          notifications: updatedNotifications,
          unreadCount: Math.max(0, newUnreadCount),
        };
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },
}));
