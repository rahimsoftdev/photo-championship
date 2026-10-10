
const announcements = [
  "🎉 May 2026 winners announced — View now",
  "📢 June competition is now open — Free to enter",
  "🏆 This month's prize: $500",
  "📅 Competition ends in 7 days",
];

const AnnouncementBar = () => {
  return (
    <div className="overflow-hidden bg-btn py-2.5 text-white">
      <div className="announcement-track flex w-max items-center">
        {[...announcements, ...announcements].map((item, index) => (
          <span
            key={index}
            className="shrink-0 whitespace-nowrap px-6 text-sm font-medium md:text-base"
          >
            {item}
            <span className="ml-6 text-white/70">·</span>
          </span>
        ))}
      </div>

      <style>{`
        .announcement-track {
          animation: announcement-scroll 35s linear infinite;
        }

        .announcement-track:hover {
          animation-play-state: paused;
        }

        @keyframes announcement-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBar;
