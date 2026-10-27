import { useCallback, useEffect, useMemo, useState } from "react";

// public ফোল্ডারের ফাইল রুট থেকে পাওয়া যায়।
// ফাইল public/data/chatData.json এ থাকলে এটা "/data/chatData.json" করো।
const CHAT_DATA_URL = `${import.meta.env.BASE_URL}chatData.json`;

// সময় দেখানোর ফরম্যাট: 12:25
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

// তারিখ দেখানোর ফরম্যাট: Today / 19 August
const formatDateLabel = (iso) => {
  const date = new Date(iso);
  if (date.toDateString() === new Date().toDateString()) return "Today";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
};

// কথোপকথনের অপর ইউজারের id বের করা
const getOtherUserId = (message, currentUserId) =>
  message.senderId === currentUserId ? message.receiverId : message.senderId;

/**
 * useChat(currentUserId)
 * যে user id দিয়ে হুক কল করবে, সেই ইউজারের চ্যাট ডাটা ফেরত দেবে।
 */
const useChat = (currentUserId) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeUserId, setActiveUserId] = useState(null);
  const [search, setSearch] = useState("");

  // public ফোল্ডার থেকে ডাটা লোড
  useEffect(() => {
    const controller = new AbortController();

    const loadChatData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(CHAT_DATA_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load chat data (${res.status})`);

        const data = await res.json();
        setUsers(Array.isArray(data.users) ? data.users : []);
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadChatData();
    return () => controller.abort();
  }, []);

  // id দিয়ে দ্রুত ইউজার খোঁজার জন্য map
  const usersById = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users]
  );

  const currentUser = usersById[currentUserId] ?? null;

  // শুধু currentUser এর নিজের মেসেজ (পুরোনো থেকে নতুন ক্রমে)
  const myMessages = useMemo(
    () =>
      messages
        .filter(
          (m) => m.senderId === currentUserId || m.receiverId === currentUserId
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [messages, currentUserId]
  );

  // সাইডবারের কথোপকথনের তালিকা (সবচেয়ে নতুন মেসেজ আগে)
  const conversations = useMemo(() => {
    const map = new Map();

    myMessages.forEach((message) => {
      const otherId = getOtherUserId(message, currentUserId);
      const user = usersById[otherId];
      if (!user) return;

      const existing = map.get(otherId) ?? {
        user,
        lastMessage: null,
        unreadCount: 0,
      };
      existing.lastMessage = message; // sorted, তাই শেষেরটাই নতুন

      if (message.receiverId === currentUserId && message.status !== "seen") {
        existing.unreadCount += 1;
      }
      map.set(otherId, existing);
    });

    return [...map.values()].sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
  }, [myMessages, usersById, currentUserId]);

  // সার্চ ফিল্টার (নাম বা username দিয়ে)
  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      ({ user }) =>
        user.name.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q)
    );
  }, [conversations, search]);

  // কিছু সিলেক্ট না করলে প্রথম কথোপকথন ডিফল্ট হিসেবে খোলা থাকবে
  const activeId = activeUserId ?? conversations[0]?.user.id ?? null;
  const activeUser = activeId ? usersById[activeId] ?? null : null;

  // খোলা চ্যাটের মেসেজ
  const activeMessages = useMemo(
    () =>
      myMessages.filter(
        (m) => m.senderId === activeId || m.receiverId === activeId
      ),
    [myMessages, activeId]
  );

  // তারিখ অনুযায়ী গ্রুপ করা মেসেজ ("19 August", "Today" ডিভাইডারের জন্য)
  const groupedMessages = useMemo(() => {
    const groups = [];
    activeMessages.forEach((message) => {
      const key = new Date(message.createdAt).toDateString();
      const last = groups[groups.length - 1];
      if (last && last.key === key) {
        last.messages.push(message);
      } else {
        groups.push({
          key,
          label: formatDateLabel(message.createdAt),
          messages: [message],
        });
      }
    });
    return groups;
  }, [activeMessages]);

  // যাদের সাথে এখনো চ্যাট নেই (Add New Chat এর জন্য)
  const availableUsers = useMemo(() => {
    const chatted = new Set(conversations.map((c) => c.user.id));
    return users.filter((u) => u.id !== currentUserId && !chatted.has(u.id));
  }, [users, conversations, currentUserId]);

  // চ্যাট খুললে ওই ইউজারের পাঠানো আনরিড মেসেজ "seen" হয়ে যাবে
  useEffect(() => {
    if (isLoading || !activeId || !currentUserId) return;

    setMessages((prev) => {
      const isUnread = (m) =>
        m.senderId === activeId &&
        m.receiverId === currentUserId &&
        m.status !== "seen";

      if (!prev.some(isUnread)) return prev;
      return prev.map((m) => (isUnread(m) ? { ...m, status: "seen" } : m));
    });
  }, [activeId, currentUserId, isLoading]);

  // কথোপকথন সিলেক্ট করা
  const selectConversation = useCallback((userId) => {
    setActiveUserId(userId);
  }, []);

  // নতুন মেসেজ পাঠানো (text / file / audio / video / image)
  const sendMessage = useCallback(
    ({ type = "text", text = "", file, audio, video, image } = {}) => {
      if (!activeId || !currentUserId) return;
      if (type === "text" && !text.trim()) return;

      const newMessage = {
        id: `msg_${Date.now()}`,
        senderId: currentUserId,
        receiverId: activeId,
        type,
        text: text.trim(),
        ...(file && { file }),
        ...(audio && { audio }),
        ...(video && { video }),
        ...(image && { image }),
        createdAt: new Date().toISOString(),
        status: "sent",
      };

      setMessages((prev) => [...prev, newMessage]);
    },
    [activeId, currentUserId]
  );

  // নতুন চ্যাট শুরু করা
  const startNewChat = useCallback((userId) => {
    setActiveUserId(userId);
  }, []);

  // মোট আনরিড মেসেজ ("Messages" এর পাশের ব্যাজের জন্য)
  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  );

  return {
    // লোডিং ও এরর
    isLoading,
    error,

    // ডাটা
    currentUser,
    activeUser,
    activeId,
    conversations: filteredConversations,
    groupedMessages,
    availableUsers,
    totalUnread,

    // সার্চ
    search,
    setSearch,

    // অ্যাকশন
    selectConversation,
    sendMessage,
    startNewChat,

    // হেল্পার
    formatTime,
  };
};

export default useChat;