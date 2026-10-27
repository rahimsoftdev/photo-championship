// ছোট ব্লক: সব জায়গায় একই রং ব্যবহার করার জন্য
const Bone = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

// সাইডবারের একটি কথোপকথনের স্কেলিটন
const ConversationRowSkeleton = () => (
  <div className="flex items-center gap-3 border-b border-[#F3F4F6] px-3 py-3 sm:px-4">
    <Bone className="h-10 w-10 shrink-0 rounded-full" />
    <div className="min-w-0 flex-1 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Bone className="h-3.5 w-24 sm:w-28" />
        <Bone className="h-3 w-8" />
      </div>
      <Bone className="h-3 w-full max-w-[200px]" />
    </div>
  </div>
);

// মেসেজ বাবলের স্কেলিটন (own = ডান দিকে)
const BubbleSkeleton = ({ own = false, width = "w-48", height = "h-12" }) => (
  <div className={`flex ${own ? "justify-end" : "justify-start"}`}>
    <Bone className={`${height} ${width} max-w-[80%] rounded-xl`} />
  </div>
);

const ChatSkeleton = ({ className = "" }) => {
  return (
    <div
      role="status"
      aria-label="Loading chat"
      className={`flex w-full overflow-hidden rounded-xl border border-[#E5E7EB] ${className}`}
    >
      {/* সাইডবার স্কেলিটন (ছোট ডিভাইসে এটাই দেখাবে, কারণ শুরুতে list ভিউ) */}
      <div className="flex h-full w-full shrink-0 flex-col overflow-hidden border-[#E5E7EB] bg-white lg:w-[300px] lg:border-r xl:w-[330px]">
        {/* হেডার */}
        <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
          <div className="flex items-center gap-2">
            <Bone className="h-6 w-28" />
            <Bone className="h-5 w-6 rounded-md" />
          </div>
          <Bone className="h-8 w-8 rounded-full" />
        </div>

        {/* সার্চ */}
        <div className="shrink-0 px-4 pb-3">
          <Bone className="h-9 w-full rounded-full" />
        </div>

        {/* তালিকা */}
        <div className="min-h-0 flex-1 overflow-hidden">
          {Array.from({ length: 9 }).map((_, i) => (
            <ConversationRowSkeleton key={i} />
          ))}
        </div>

        {/* Add New Chat বাটন */}
        <div className="shrink-0 border-t border-[#F3F4F6] p-3 sm:p-4">
          <Bone className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* মেসেজ এলাকার স্কেলিটন (শুধু lg থেকে বড় স্ক্রিনে) */}
      <div className="hidden h-full min-w-0 flex-1 flex-col overflow-hidden lg:flex">
        {/* হেডার */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#E5E7EB] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Bone className="h-10 w-10 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Bone className="h-3.5 w-36" />
              <Bone className="h-3 w-24" />
            </div>
          </div>
          <Bone className="h-8 w-8 rounded-full" />
        </div>

        {/* মেসেজ */}
        <div className="min-h-0 flex-1 space-y-4 overflow-hidden px-5 py-4">
          {/* তারিখ ডিভাইডার */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[#E5E7EB]" />
            <Bone className="h-3 w-16" />
            <span className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          <BubbleSkeleton width="w-72" height="h-16" />
          <BubbleSkeleton width="w-64" height="h-14" />
          <BubbleSkeleton own width="w-96" height="h-20" />
          <BubbleSkeleton width="w-56" height="h-10" />
          <BubbleSkeleton own width="w-64" height="h-14" />
          <BubbleSkeleton width="w-80" height="h-40" />
        </div>

        {/* ইনপুট */}
        <div className="shrink-0 px-5 pb-4 pt-2">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3">
            <Bone className="h-4 w-40" />
            <div className="mt-4 flex items-center justify-end gap-2">
              <Bone className="h-8 w-8 rounded-full" />
              <Bone className="h-8 w-8 rounded-full" />
              <Bone className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default ChatSkeleton;