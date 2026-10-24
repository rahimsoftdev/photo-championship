
import MarqueePackage from "react-fast-marquee";

const Marquee = MarqueePackage.default ?? MarqueePackage;

const announcements = [
  "🎉 May 2026 winners announced — View now",
  "📢 June competition is now open — Free to enter",
  "🏆 This month's prize: $500",
  "📅 Competition ends in 7 days",
];

const AnnouncementBar = () => {
  return (
    <div className="bg-primary">
      <div className="overflow-hidden  py-2.5 text-white max-w-main mx-auto">
        <Marquee
          speed={40}
          direction="left"
          pauseOnHover
          gradient={false}
          autoFill
        >
          {announcements.map((item, index) => (
            <span
              key={index}
              className="shrink-0 whitespace-nowrap px-4 text-xs font-medium min-[400px]:px-5 min-[400px]:text-sm sm:px-6 md:text-base"
            >
              {item}
              <span className="ml-4 text-white/70 min-[400px]:ml-5 sm:ml-6">
                ·
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default AnnouncementBar;
