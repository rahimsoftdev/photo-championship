// Skeleton blocks: shob jaygay ekoi style, tai ekta choto helper
const Block = ({ className = "" }) => (
  <div className={`rounded-md bg-gray-200 ${className}`} />
);

// ---------- 1. Main image carousel ----------
const ImageSkeleton = ({ isDashboard }) => (
  <section className={isDashboard ? "" : "pt-5 sm:pt-12 lg:pt-15"}>
    <div className="relative w-full overflow-hidden rounded-2xl bg-gray-200">
      <div className="aspect-[4/3] max-h-[260px] w-full sm:aspect-[16/10] sm:max-h-[310px] md:max-h-[360px] lg:aspect-[16/9] xl:max-h-[400px]" />

      {/* arrow buttons */}
      <div className="absolute left-3 top-1/2 size-10 -translate-y-1/2 rounded-full bg-gray-300 sm:left-5 sm:size-12" />
      <div className="absolute right-3 top-1/2 size-10 -translate-y-1/2 rounded-full bg-gray-300 sm:right-5 sm:size-12" />

      {/* counter */}
      <div className="absolute bottom-4 left-1/2 h-7 w-16 -translate-x-1/2 rounded-full bg-gray-300" />
    </div>
  </section>
);

// ---------- 2. Zodiac gallery grid ----------
const InlineItem = () => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <div className="flex items-center justify-between gap-1">
      <div className="flex min-w-0 items-center gap-1">
        <Block className="size-4 shrink-0 sm:size-5" />
        <Block className="h-2.5 w-8 sm:w-12" />
      </div>
      <div className="size-3.5 shrink-0 rounded-full bg-gray-200 sm:size-4" />
    </div>
    <Block className="aspect-[3/2] w-full" />
  </div>
);

const StackedItem = () => (
  <div className="flex min-w-0 flex-col items-center gap-1.5">
    <div className="size-4 rounded-full bg-gray-200" />
    <Block className="size-5" />
    <Block className="h-2.5 w-3/4" />
    <Block className="aspect-[4/5] w-full" />
  </div>
);

const GallerySkeleton = () => (
  <div className="w-full pt-5">
    {/* Mobile/tablet: duto row */}
    <div className="space-y-5 md:hidden">
      {[0, 1].map((row) => (
        <div key={row}>
          <Block className="h-7 w-full !rounded-b-full" />
          <div className="mt-2 grid grid-cols-6 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <InlineItem key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Desktop: ek row e 12 ta */}
    <div className="hidden md:block">
      <div className="flex gap-4">
        <Block className="h-7 flex-1 !rounded-b-full" />
        <Block className="h-7 flex-1 !rounded-b-full" />
      </div>
      <div className="mt-3 grid grid-cols-12 gap-2 lg:gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <StackedItem key={i} />
        ))}
      </div>
    </div>
  </div>
);

// ---------- 3. Video ----------
const VideoSkeleton = () => (
  <section className="mx-auto w-full max-w-main">
    <div className="relative mt-5 aspect-video max-h-[260px] w-full overflow-hidden rounded-2xl bg-gray-200 sm:max-h-[310px] md:max-h-[360px] xl:max-h-[400px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-14 rounded-full bg-gray-300 sm:size-16 md:size-20 lg:size-24" />
      </div>
    </div>
  </section>
);

// ---------- 4. Info section (generic layout) ----------
const InfoSkeleton = () => (
  <section className="mt-8 space-y-5 sm:mt-10">
    {/* Title + action buttons */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1 space-y-3">
        <Block className="h-7 w-3/4 sm:h-9 sm:w-1/2" />
        <Block className="h-3 w-1/3" />
      </div>
      <div className="flex gap-2">
        <Block className="h-10 w-24 !rounded-lg" />
        <Block className="h-10 w-10 !rounded-lg" />
      </div>
    </div>

    {/* Author row */}
    <div className="flex items-center gap-3">
      <div className="size-11 rounded-full bg-gray-200" />
      <div className="space-y-2">
        <Block className="h-3.5 w-32" />
        <Block className="h-3 w-20" />
      </div>
    </div>

    {/* Description */}
    <div className="space-y-2.5">
      <Block className="h-3.5 w-full" />
      <Block className="h-3.5 w-full" />
      <Block className="h-3.5 w-5/6" />
      <Block className="h-3.5 w-2/3" />
    </div>

    {/* Stats cards */}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Block key={i} className="h-20 !rounded-xl" />
      ))}
    </div>
  </section>
);

// ---------- 5. Support section (public page e) ----------
const SupportSkeleton = () => (
  <div className="mx-auto mt-10 w-full overflow-hidden rounded-2xl border border-[#C6C6CD] sm:mt-12 lg:mt-section">
    {/* Header */}
    <div className="flex items-start justify-between gap-3 border-b border-[#C6C6CD] bg-[#F8F9FA] p-4 sm:p-6">
      <div className="flex flex-1 items-start gap-3 sm:items-center sm:gap-4">
        <div className="size-8 shrink-0 rounded-full bg-gray-200 sm:size-14" />
        <div className="flex-1 space-y-2">
          <Block className="h-4 w-1/2 sm:h-5" />
          <Block className="h-3 w-full max-w-lg" />
        </div>
      </div>
      <Block className="size-6 shrink-0" />
    </div>

    {/* Body */}
    <div className="space-y-6 bg-white p-4 sm:space-y-7 sm:p-6 md:p-8">
      {/* Support type radios */}
      <div className="space-y-3">
        <Block className="h-4 w-56" />
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Block className="h-4 w-36" />
          <Block className="h-4 w-36" />
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-3">
        <Block className="h-4 w-32" />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Block key={i} className="h-9 !rounded-xl md:h-11" />
          ))}
        </div>
        <Block className="h-9 w-full !rounded-xl sm:max-w-xs md:h-11" />
      </div>

      {/* Details */}
      <div className="space-y-4">
        <Block className="h-4 w-28" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              <Block className="h-3 w-24" />
              <Block className="h-9 w-full !rounded-xl md:h-11" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Footer buttons */}
    <div className="flex flex-col-reverse gap-2 border-t border-[#C6C6CD] bg-[#F8F9FA] p-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:p-6">
      <Block className="h-9 w-full !rounded-lg sm:w-24 md:h-11" />
      <Block className="h-9 w-full !rounded-lg sm:w-32 md:h-11" />
    </div>
  </div>
);

// ---------- 6. Global rankings ----------
const RankingsSkeleton = () => (
  <div className="mt-10 overflow-hidden rounded-[20px] border border-[#E6E6F2] bg-[#F9F9FF] sm:mt-12 lg:mt-section">
    <div className="px-4 py-5">
      <Block className="h-5 w-40" />
    </div>

    {/* Table header */}
    <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-3 border-y border-[#E1E1EF] bg-[#F9F9FF] px-4 py-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Block key={i} className="h-2.5 w-3/4" />
      ))}
    </div>

    {/* Rows */}
    <div className="bg-white">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_2fr_1fr_1fr] items-center gap-3 border-b border-[#EEEEF6] px-4 py-3.5"
        >
          <div className="size-6 rounded-full bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="size-[26px] shrink-0 rounded-full bg-gray-200" />
            <Block className="h-3 w-24" />
          </div>
          <Block className="mx-auto h-3 w-6" />
          <Block className="mx-auto h-5 w-14 !rounded-full" />
        </div>
      ))}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between bg-[#F0F0FD] px-4 py-3.5">
      <Block className="h-3 w-44" />
      <div className="flex gap-1.5">
        <div className="size-7 rounded-full bg-gray-200" />
        <div className="size-7 rounded-full bg-gray-200" />
      </div>
    </div>
  </div>
);

// ---------- 7. Comments (generic layout) ----------
const CommentsSkeleton = () => (
  <section className="mt-10 space-y-6 sm:mt-12">
    <Block className="h-6 w-36" />

    {/* Comment input */}
    <div className="flex items-start gap-3">
      <div className="size-10 shrink-0 rounded-full bg-gray-200" />
      <Block className="h-20 flex-1 !rounded-xl" />
    </div>

    {/* Comment list */}
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-start gap-3">
        <div className="size-10 shrink-0 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <Block className="h-3.5 w-32" />
          <Block className="h-3 w-full" />
          <Block className="h-3 w-4/5" />
        </div>
      </div>
    ))}
  </section>
);

// ---------- Main skeleton ----------
const ArtworkDetailsSkeleton = ({ isDashboard = false }) => {
  return (
    <main
      className={`animate-pulse ${isDashboard ? "w-full" : "mx-auto w-full max-w-main px-4"}`}
      aria-busy="true"
      aria-label="Loading artwork details"
    >
      <ImageSkeleton isDashboard={isDashboard} />
      <GallerySkeleton />
      <VideoSkeleton />
      <InfoSkeleton />

      {/* Support section shudhu public page e */}
      {!isDashboard && <SupportSkeleton />}

      <RankingsSkeleton />
      <CommentsSkeleton />
    </main>
  );
};

export default ArtworkDetailsSkeleton;