import { create } from "zustand";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authStore";
import DOMPurify from "isomorphic-dompurify";

const ENDPOINT = import.meta.env.RENDER_URL

const getTokenFromCookies = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "token") {
      return value;
    }
  }
  return null;
};

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

    const token = getTokenFromCookies();
    if (!token) {
      console.error("No authentication token found for socket connection");
      return;
    }

    const socket = io(ENDPOINT, {
      withCredentials: true,
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("join_user_room", userId);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      if (error.message.includes("Authentication")) {
        console.error("Socket authentication failed. Please re-login.");
        toast.error("Connection failed. Please re-login.");
      }
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data.message);
      toast.error(data.message || "Socket error occurred");
    });

    socket.on("receive_message", (message) => {
      const { activeConversation, messages, conversations } = get();

      const sanitizedMessage = {
        ...message,
        content: DOMPurify.sanitize(message.content, {
          ALLOWED_TAGS: [],
          KEEP_CONTENT: true,
        }),
      };

      if (
        activeConversation &&
        sanitizedMessage.conversationId === activeConversation._id
      ) {
        const exists = messages.find((m) => m._id === sanitizedMessage._id);
        if (!exists) {
          set({ messages: [...messages, sanitizedMessage] });
        }
      }

      const updatedConversations = conversations.map((c) => {
        if (c._id === sanitizedMessage.conversationId) {
          return {
            ...c,
            lastMessage: sanitizedMessage,

            unreadCounts:
              activeConversation && c._id === activeConversation._id
                ? c.unreadCounts
                : c.unreadCounts,
          };
        }
        return c;
      });

      updatedConversations.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      set({ conversations: updatedConversations });
    });

    socket.on("conversation_updated", (data) => {
      const { conversations, fetchConversations } = get();

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
      const exists = state.conversations.find(
        (c) => c._id === conversation._id
      );
      if (exists) return state;
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

      if (
        !nextActive &&
        currentActive?._id === conversationId &&
        currentActive.participants
      ) {
        nextActive = currentActive;
      }

      if (!nextActive) {
        nextActive = { _id: conversationId };
      }

      set({
        messages: res.data.data.messages,
        activeConversation: nextActive,
      });

      const { conversations: currentConvs } = get();

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
      const msg = error.response?.data?.message || "Cannot initiate messaging";
      toast.error(msg);
      return { allowed: false, error: msg };
    }
  },

  sendMessage: async (content, replyTo = null) => {
    const { activeConversation, socket, messages } = get();
    if (!activeConversation) return;

    if (!content || !content.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (content.length > 2000) {
      toast.error("Message is too long (max 2000 characters)");
      return;
    }

    try {
      const res = await axios.post(
        `${ENDPOINT}/api/v1/messages`,
        {
          conversationId: activeConversation._id,
          content: content.trim(),
          replyTo,
        },
        { withCredentials: true }
      );

      const newMessage = res.data.data.message;

      const sanitizedMessage = {
        ...newMessage,
        content: DOMPurify.sanitize(newMessage.content, {
          ALLOWED_TAGS: [],
          KEEP_CONTENT: true,
        }),
      };

      const currentMessages = get().messages;
      if (!currentMessages.find((m) => m._id === sanitizedMessage._id)) {
        set({ messages: [...currentMessages, sanitizedMessage] });
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message";
      toast.error(errorMsg);
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
