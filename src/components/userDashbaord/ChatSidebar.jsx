import { useState } from "react";
import { FiEdit, FiPlus, FiSearch, FiX } from "react-icons/fi";

// স্ক্রলবার লুকানো (স্ক্রল কাজ করবে) + বাইরে স্ক্রল চেইন বন্ধ
const SCROLL_AREA =
  "overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

const STATUS_COLORS = {
  online: "bg-green-500",
  away: "bg-yellow-400",
  busy: "bg-red-500",
  offline: "bg-gray-300",
};

// শেষ মেসেজের প্রিভিউ টেক্সট
const getPreview = (message, currentUserId) => {
  const prefix = message.senderId === currentUserId ? "You: " : "";
  switch (message.type) {
    case "file":
      return `${prefix}${message.file?.name ?? "File"}`;
    case "audio":
      return `${prefix}Voice message`;
    case "video":
      return `${prefix}Video`;
    case "image":
      return `${prefix}Photo`;
    default:
      return `${prefix}${message.text}`;
  }
};

const Avatar = ({ user, size = "h-10 w-10" }) => (
  <div className={`relative shrink-0 ${size}`}>
    <img
      src={user.avatar}
      alt={user.name}
      className="h-full w-full rounded-full object-cover"
    />
    <span
      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
        STATUS_COLORS[user.status] ?? STATUS_COLORS.offline
      }`}
    />
  </div>
);

const ChatSidebar = ({
  currentUserId,
  conversations,
  activeId,
  onSelect,
  search,
  onSearch,
  totalUnread,
  availableUsers,
  onStartNewChat,
  formatTime,
}) => {
  const [showNewChat, setShowNewChat] = useState(false);

  const handleStartNewChat = (userId) => {
    onStartNewChat(userId);
    setShowNewChat(false);
  };

  return (
    <aside className="relative flex h-full w-full min-w-0 flex-col overflow-hidden bg-white">
      {/* হেডার */}
      <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#111827] sm:text-xl">Messages</h2>
          {totalUnread > 0 && (
            <span className="rounded-md bg-[#E8EAFB] px-1.5 py-0.5 text-[10px] font-semibold text-[#4048CD]">
              {totalUnread}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowNewChat(true)}
          aria-label="Start new chat"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-gray-600 transition hover:bg-gray-50"
        >
          <FiEdit size={15} />
        </button>
      </div>

      {/* সার্চ */}
      <div className="shrink-0 px-4 pb-3">
        <div className="flex items-center gap-2 rounded-full border border-[#E5E7EB] px-3 py-2 focus-within:border-[#4048CD]">
          <FiSearch className="shrink-0 text-gray-500" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* কথোপকথনের তালিকা (স্ক্রলবার নেই, বাইরে স্ক্রল হবে না) */}
      <div className={`min-h-0 flex-1 ${SCROLL_AREA}`}>
        {conversations.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-400">
            No conversations found
          </p>
        ) : (
          conversations.map(({ user, lastMessage, unreadCount }) => {
            const isActive = user.id === activeId;
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => onSelect(user.id)}
                className={`flex w-full items-center gap-3 border-b border-l-[3px] border-[#F3F4F6] px-3 py-3 text-left transition hover:bg-gray-50 sm:px-4 ${
                  isActive
                    ? "border-l-[#4048CD] bg-[#EEF0FF]"
                    : "border-l-transparent"
                }`}
              >
                <Avatar user={user} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-semibold text-[#111827]">
                      {user.name}
                    </h3>
                    <span className="shrink-0 text-[11px] text-gray-400">
                      {formatTime(lastMessage.createdAt)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-gray-500">
                      {getPreview(lastMessage, currentUserId)}
                    </p>
                    {unreadCount > 0 && (
                      <span className="shrink-0 rounded-full bg-[#4048CD] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Add New Chat */}
      <div className="shrink-0 border-t border-[#F3F4F6] p-3 sm:p-4">
        <button
          type="button"
          onClick={() => setShowNewChat(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#E8EAFB] py-2.5 text-sm font-semibold text-[#4048CD] transition hover:bg-[#dcdffa]"
        >
          Add New Chat <FiPlus size={16} />
        </button>
      </div>

      {/* নতুন চ্যাটের প্যানেল */}
      {showNewChat && (
        <div className="absolute inset-0 z-10 flex flex-col bg-white">
          <div className="flex shrink-0 items-center justify-between border-b border-[#F3F4F6] px-4 py-3">
            <h3 className="text-base font-bold text-[#111827]">New chat</h3>
            <button
              type="button"
              onClick={() => setShowNewChat(false)}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className={`min-h-0 flex-1 ${SCROLL_AREA}`}>
            {availableUsers.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-400">
                No more users available
              </p>
            ) : (
              availableUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleStartNewChat(user.id)}
                  className="flex w-full items-center gap-3 border-b border-[#F3F4F6] px-4 py-3 text-left transition hover:bg-gray-50"
                >
                  <Avatar user={user} />
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-[#111827]">
                      {user.name}
                    </h4>
                    <p className="truncate text-xs text-gray-500">{user.username}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ChatSidebar;