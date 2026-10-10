
const announcements = [
  "🎉 May 2026 winners announced — View now",
  "📢 June competition is now open — Free to enter",
  "🏆 This month's prize: $500",
  "📅 Competition ends in 7 days",
];

const AnnouncementBar = () => {
  return (
    <div className="overflow-hidden bg-[#4048CD] py-2.5 text-white">
      <div className="flex  animate-marquee items-center max-w-[1280px] ">
        {[...announcements, ...announcements].map((announcement, index) => (
          <div
            key={index}
            className="flex shrink-0 items-center whitespace-nowrap"
          >
            <p className="px-6 text-sm font-medium md:text-base">
              {announcement}
            </p>
            <span className="text-white/70">·</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
