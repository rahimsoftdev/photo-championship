import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiDownload,
  FiFileText,
  FiMoreVertical,
  FiPause,
  FiPlay,
} from "react-icons/fi";
import { BsCheck2All } from "react-icons/bs";

// স্ক্রলবার লুকানো (স্ক্রল কাজ করবে) + বাইরে স্ক্রল চেইন বন্ধ
const SCROLL_AREA =
  "overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

// অডিওর ওয়েভফর্ম বারের উচ্চতা (ডেমো)
const WAVE_BARS = [
  6, 10, 16, 8, 20, 12, 24, 14, 8, 18, 26, 12, 20, 8, 14, 22, 10, 16, 24, 12,
  8, 18, 14, 20, 10, 16, 8, 12,
];

const STATUS_LABEL = { sent: "Sent", delivered: "Delivered", seen: "Seen" };

/* ---------- অডিও মেসেজ ---------- */
const AudioMessage = ({ audio, own }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.pause();
    else el.play().catch(() => {});
  };

  return (
    <div className="flex w-[210px] items-center gap-2.5 sm:w-[250px]">
      <audio
        ref={audioRef}
        src={audio.url}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const { currentTime, duration } = e.currentTarget;
          if (duration) setProgress(currentTime / duration);
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          own ? "bg-white text-[#4048CD]" : "bg-[#4048CD] text-white"
        }`}
      >
        {playing ? <FiPause size={14} /> : <FiPlay size={14} className="ml-0.5" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex h-7 items-center gap-[2px]">
          {WAVE_BARS.map((h, i) => {
            const active = i / WAVE_BARS.length < progress;
            return (
              <span
                key={i}
                style={{ height: h }}
                className={`w-[3px] rounded-full ${
                  own
                    ? active
                      ? "bg-white"
                      : "bg-white/50"
                    : active
                    ? "bg-[#4048CD]"
                    : "bg-[#4048CD]/30"
                }`}
              />
            );
          })}
        </div>
        <span className={`text-[10px] font-medium ${own ? "text-white" : "text-gray-600"}`}>
          {audio.duration}
        </span>
      </div>
    </div>
  );
};

/* ---------- ভিডিও মেসেজ ---------- */
const VideoMessage = ({ video }) => {
  const [playing, setPlaying] = useState(false);

  // থাম্বনেইল না থাকলে বা প্লে করলে সরাসরি ভিডিও দেখাবে
  if (playing || !video.thumbnail) {
    return (
      <video
        src={video.url}
        controls
        autoPlay={playing}
        preload="metadata"
        className="max-h-[260px] w-full rounded-lg bg-black"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label="Play video"
      className="relative block w-full overflow-hidden rounded-lg"
    >
      <img
        src={video.thumbnail}
        alt="Video thumbnail"
        className="h-[150px] w-full object-cover sm:h-[200px]"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white">
          <FiPlay size={20} className="ml-0.5" />
        </span>
      </span>
    </button>
  );
};

/* ---------- ফাইল মেসেজ ---------- */
const FileMessage = ({ file, own }) => (
  <a
    href={file.url}
    download={file.name}
    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
      own ? "border-white/30 bg-white/10" : "border-[#E5E7EB] bg-[#F9FAFB]"
    }`}
  >
    <FiFileText className={own ? "text-white" : "text-[#4048CD]"} size={22} />
    <div className="min-w-0 flex-1">
      <p className={`truncate text-sm font-semibold ${own ? "text-white" : "text-[#111827]"}`}>
        {file.name}
      </p>
      <p className={`text-[11px] ${own ? "text-white/80" : "text-gray-500"}`}>
        {file.size} • {file.ext}
      </p>
    </div>
    <FiDownload className={own ? "text-white" : "text-gray-500"} size={16} />
  </a>
);

/* ---------- একটি মেসেজ বাবল ---------- */
const MessageBubble = ({ message, own, formatTime }) => {
  const isMedia = message.type === "video" || message.type === "image";

  const content = () => {
    switch (message.type) {
      case "file":
        return <FileMessage file={message.file} own={own} />;
      case "audio":
        return <AudioMessage audio={message.audio} own={own} />;
      case "video":
        return <VideoMessage video={message.video} />;
      case "image":
        return (
          <img
            src={message.image?.url}
            alt="Shared"
            loading="lazy"
            className="max-h-[260px] w-full rounded-lg object-cover"
          />
        );
      default:
        return (
          <p className="whitespace-pre-wrap break-words text-[13px] leading-5">
            {message.text}
          </p>
        );
    }
  };

  return (
    <div className={`flex flex-col ${own ? "items-end" : "items-start"}`}>
      <div
        className={`rounded-xl ${
          isMedia ? "w-[260px] max-w-full p-1.5 sm:w-[340px]" : "max-w-[85%] px-3 py-2 sm:max-w-[70%]"
        } ${
          own
            ? "bg-[#4F46E5] text-white"
            : "border border-[#E5E7EB] bg-white text-[#111827]"
        }`}
      >
        {content()}
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            own ? "text-white/80" : "text-gray-400"
          } ${isMedia ? "px-1 pb-0.5" : ""}`}
        >
          <span>{formatTime(message.createdAt)}</span>
          <BsCheck2All size={13} />
        </div>
      </div>

      {own && (
        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500">
          <BsCheck2All className="text-green-500" size={12} />
          {STATUS_LABEL[message.status] ?? "Sent"}
        </span>
      )}
    </div>
  );
};

/* ---------- মূল কম্পোনেন্ট ---------- */
const ChatMessages = ({
  currentUserId,
  activeUser,
  groupedMessages,
  formatTime,
  onBack,
}) => {
  const bottomRef = useRef(null);

  // নতুন মেসেজ এলে বা চ্যাট বদলালে নিচে স্ক্রল
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [activeUser?.id, groupedMessages]);

  if (!activeUser) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-6 text-center text-sm text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    // কোনো bg নেই, তাই ChatPage এর bg দেখা যাবে
    <div className="flex min-h-0 flex-1 flex-col">
      {/* হেডার */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-[#E5E7EB] px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* শুধু ছোট ডিভাইসে ব্যাক বাটন */}
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 lg:hidden"
          >
            <FiArrowLeft size={20} />
          </button>

          <img
            src={activeUser.avatar}
            alt={activeUser.name}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-bold text-[#111827]">
                {activeUser.name}
              </h3>
              {activeUser.status === "online" && (
                <span className="hidden shrink-0 items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-600 min-[360px]:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Online
                </span>
              )}
            </div>
            <p className="truncate text-xs text-gray-500">{activeUser.username}</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="More options"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        >
          <FiMoreVertical size={18} />
        </button>
      </header>

      {/* মেসেজ তালিকা (স্ক্রলবার নেই, বাইরে স্ক্রল হবে না) */}
      <div className={`min-h-0 flex-1 px-3 py-4 sm:px-5 ${SCROLL_AREA}`}>
        {groupedMessages.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            No messages yet. Say hi to {activeUser.name}!
          </p>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.key} className="mb-4">
              {/* তারিখ ডিভাইডার */}
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="text-xs text-gray-500">{group.label}</span>
                <span className="h-px flex-1 bg-[#E5E7EB]" />
              </div>

              <div className="space-y-3">
                {group.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    own={message.senderId === currentUserId}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatMessages;