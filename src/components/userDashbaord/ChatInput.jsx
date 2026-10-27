import { useEffect, useRef, useState } from "react";
import { FiMic, FiPaperclip, FiSend, FiSmile } from "react-icons/fi";

const EMOJIS = [
  "😀", "😂", "😍", "😊", "😎", "🥰", "😢", "😡",
  "👍", "👏", "🙏", "🔥", "🎉", "❤️", "💯", "✅",
];

// ফাইলের সাইজ সুন্দর করে দেখানো
const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}kb`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}mb`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}gb`;
};

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const wrapperRef = useRef(null);

  // বাইরে ক্লিক করলে ইমোজি প্যানেল বন্ধ
  useEffect(() => {
    if (!showEmoji) return;
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showEmoji]);

  // টেক্সটএরিয়া নিজে থেকে বড় হবে (সর্বোচ্চ ১২০px)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend({ type: "text", text });
    setText("");
  };

  const handleKeyDown = (e) => {
    // Enter = send, Shift+Enter = নতুন লাইন
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "file";

    if (file.type.startsWith("image/")) {
      onSend({ type: "image", image: { url } });
    } else if (file.type.startsWith("video/")) {
      onSend({ type: "video", video: { thumbnail: "", url, duration: "" } });
    } else if (file.type.startsWith("audio/")) {
      onSend({ type: "audio", audio: { url, duration: "" } });
    } else {
      onSend({
        type: "file",
        file: { name: file.name, size: formatSize(file.size), ext, url },
      });
    }

    e.target.value = ""; // একই ফাইল আবার সিলেক্ট করা যাবে
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="px-3 pb-3 pt-2 sm:px-5 sm:pb-4">
      <div
        ref={wrapperRef}
        className="relative rounded-2xl border border-[#E5E7EB] bg-white p-2.5 shadow-sm focus-within:border-[#4048CD] sm:p-3"
      >
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
            className="mt-1 shrink-0 text-gray-500 hover:text-[#4048CD]"
          >
            <FiPaperclip size={17} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="max-h-[120px] min-h-[28px] w-full resize-none bg-transparent py-1 text-sm outline-none placeholder:text-gray-500"
          />
        </div>

        <div className="mt-1 flex items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            aria-label="Emoji"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
          >
            <FiSmile size={16} />
          </button>

          <button
            type="button"
            aria-label="Voice message"
            title="Voice message (coming soon)"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
          >
            <FiMic size={16} />
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex h-8 items-center gap-1.5 rounded-full bg-[#4F46E5] px-4 text-xs font-semibold text-white transition hover:bg-[#4048CD] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send <FiSend size={13} />
          </button>
        </div>

        {/* ইমোজি প্যানেল */}
        {showEmoji && (
          <div className="absolute bottom-full right-0 z-20 mb-2 grid w-[220px] grid-cols-8 gap-1 rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-lg">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="rounded p-0.5 text-lg hover:bg-gray-100"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;