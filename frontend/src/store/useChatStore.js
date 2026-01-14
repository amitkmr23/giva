import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  isTyping: false,
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();

    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, isSoundEnabled } = get();

      const isForMe = newMessage.receiverId === authUser._id;
      const isActiveChat =
        selectedUser && newMessage.senderId === selectedUser._id;

      if (isActiveChat) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
      } else if (isForMe) {
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.senderId]:
              (state.unreadCounts[newMessage.senderId] || 0) + 1,
          },
        }));
      }

      if (isSoundEnabled && isForMe) {
        const sound = new Audio("/sounds/notification.mp3");
        sound.currentTime = 0;
        sound.play().catch(() => { });
      }
    });
    socket.on("messagesRead", ({ readerId, seenAt }) => {
      const myId = useAuthStore.getState().authUser._id;

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.senderId === myId && msg.receiverId === readerId
            ? { ...msg, isRead: true, seenAt }
            : msg
        ),
      }));
    });


    // 🔹 TYPING LISTENER
    socket.on("typing", ({ from }) => {
      const { selectedUser } = get();
      if (selectedUser && selectedUser._id === from) {
        set({ isTyping: true });
      }
    });

    // 🔹 STOP TYPING LISTENER
    socket.on("stopTyping", ({ from }) => {
      const { selectedUser } = get();
      if (selectedUser && selectedUser._id === from) {
        set({ isTyping: false });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("typing");
    socket.off("stopTyping");
    socket.off("messagesRead");
  },
  fetchUnreadCounts: async () => {
    try {
      const res = await axios.get("/api/messages/unread-counts");

      set({ unreadCounts: res.data });
    } catch (err) {
      console.error("Failed to fetch unread counts", err);
    }
  },
  unreadCounts: {},

  fetchUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread-counts");
      set({ unreadCounts: res.data });
    } catch (err) {
      console.error("Failed to fetch unread counts", err);
    }
  },

  markAsRead: async (userId) => {
    try {
      await axiosInstance.put(`/messages/read/${userId}`);

      // clear unread count locally
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [userId]: 0,
        },
      }));
    } catch (error) {
      console.error("Failed to mark messages as read", error);
    }
  },
}));
// import { create } from "zustand";

export const useThemeStore = create((set) => ({
  dark: localStorage.getItem("theme") === "dark",

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.dark ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return { dark: !state.dark };
    }),
}));
