import { create } from "zustand";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authStore";

const ENDPOINT = import.meta.env.VITE_URL || "http://localhost:8000"; // Adjust as needed
// Note: In Vite, we often use a proxy or relative URL if configured, but socket.io needs the host usually.

const useChatStore = create((set, get) => ({
  socket: null,
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  onlineUsers: [],

  connectSocket: (userId) => {
    const existingSocket = get().socket;
    if (existingSocket) return;

    const socket = io(ENDPOINT, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("join_user_room", userId);
    });

    socket.on("receive_message", (message) => {
      const { activeConversation, messages, conversations } = get();

      // If the message belongs to the active conversation, append it
      if (
        activeConversation &&
        message.conversationId === activeConversation._id
      ) {
        // Prevent duplicates
        const exists = messages.find((m) => m._id === message._id);
        if (!exists) {
          set({ messages: [...messages, message] });
        }
      }

      // Update the conversation list preview
      const updatedConversations = conversations.map((c) => {
        if (c._id === message.conversationId) {
          return {
            ...c,
            lastMessage: message,
            // Increment unread if not active
            unreadCounts:
              activeConversation && c._id === activeConversation._id
                ? c.unreadCounts // No change if reading
                : c.unreadCounts, // This logic is complex because unreadCounts is a Map in backend but Obj in JSON.
            // For now simplified:
          };
        }
        return c;
      });

      // Move to top
      updatedConversations.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      set({ conversations: updatedConversations });
    });

    // Listen for updates when in the list view (not necessarily open chat)
    socket.on("conversation_updated", (data) => {
      const { conversations, fetchConversations } = get();
      // simplest strategy: refetch or manually update.
      // Let's refetch for accuracy for now.
      fetchConversations();
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null });
  },

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${ENDPOINT}/api/v1/messages`, {
        withCredentials: true,
      });
      set({ conversations: res.data.data.conversations });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addConversation: (conversation) => {
    set((state) => {
      // Check if exists
      const exists = state.conversations.find(
        (c) => c._id === conversation._id
      );
      if (exists) return state; // or update it?
      return { conversations: [conversation, ...state.conversations] };
    });
  },

  fetchMessages: async (conversationId) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(
        `${ENDPOINT}/api/v1/messages/${conversationId}`,
        { withCredentials: true }
      );

      const { conversations, activeConversation: currentActive } = get();
      const existingConv = conversations.find((c) => c._id === conversationId);

      let nextActive = existingConv;

      // If not in list, but we already have it as active (passed from new chat), keep it
      if (
        !nextActive &&
        currentActive?._id === conversationId &&
        currentActive.participants
      ) {
        nextActive = currentActive;
      }

      // If still nothing, we only have ID (fallback)
      if (!nextActive) {
        nextActive = { _id: conversationId };
      }

      set({
        messages: res.data.data.messages,
        activeConversation: nextActive,
      });

      // Optimistically clear unread count for this conversation
      const { conversations: currentConvs } = get();
      // We need to access the auth store to get the current user ID
      // Assuming useAuthStore is imported from corresponding file
      // Dynamic import or direct access if available in scope.
      // Since we can't easily import a hook here if not already, we might rely on the fact that
      // the backend clears it, so we just need to update our local state to match.
      // But we need the userId to know which key to clear.

      // FIX: Access authStore state directly
      const userId = useAuthStore.getState().authUser?._id;

      if (userId) {
        const updatedConvs = currentConvs.map((c) => {
          if (c._id === conversationId) {
            return {
              ...c,
              unreadCounts: {
                ...c.unreadCounts,
                [userId]: 0,
              },
            };
          }
          return c;
        });
        set({ conversations: updatedConvs });
      }

      // Join the chat room
      const socket = get().socket;
      if (socket) socket.emit("join_chat", conversationId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load messages");
    } finally {
      set({ isLoading: false });
    }
  },

  checkAccess: async (recipientId) => {
    try {
      const res = await axios.post(
        `${ENDPOINT}/api/v1/messages/check-access`,
        { recipientId },
        { withCredentials: true }
      );

      if (res.data.action === "REDIRECT_WHATSAPP") {
        return { allowed: false, ...res.data };
      }

      return { allowed: true, conversation: res.data.data.conversation };
    } catch (error) {
      // If 403 or other error
      const msg = error.response?.data?.message || "Cannot initiate messaging";
      toast.error(msg);
      return { allowed: false, error: msg };
    }
  },

  sendMessage: async (content, replyTo = null) => {
    const { activeConversation, socket, messages } = get();
    if (!activeConversation) return;

    try {
      const res = await axios.post(
        `${ENDPOINT}/api/v1/messages`,
        {
          conversationId: activeConversation._id,
          content,
          replyTo,
        },
        { withCredentials: true }
      );

      const newMessage = res.data.data.message;

      // Optimistic / Direct update
      // Check if already added by socket (race condition)
      const currentMessages = get().messages;
      if (!currentMessages.find((m) => m._id === newMessage._id)) {
        set({ messages: [...currentMessages, newMessage] });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  },

  availableVendors: [],
  fetchAvailableVendors: async () => {
    try {
      const res = await axios.get(
        `${ENDPOINT}/api/v1/messages/available-vendors`,
        {
          withCredentials: true,
        }
      );
      set({ availableVendors: res.data.data.vendors });
      return res.data.data.vendors;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
}));

export default useChatStore;
