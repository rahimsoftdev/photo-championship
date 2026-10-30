import {
  FaTrophy,
  FaUsers,
  FaCamera,
  FaStar,
  FaCheck,
  FaGlobe,
} from "react-icons/fa";

import IconDesign from "../ui/IconDesign";

// Platform features data
const platformFeatures = [
  {
    id: 1,
    icon: FaTrophy,
    title: "Monthly Cash Prizes",
    description:
      "Real money paid via PayPal to top 3 finishers every month.",
  },
  {
    id: 2,
    icon: FaUsers,
    title: "Community Voting",
    description:
      "Transparent peer voting — every registered user can participate.",
  },
  {
    id: 3,
    icon: FaCamera,
    title: "3 Competition Formats",
    description:
      "Single photo, story albums, and zodiac themes for every style.",
  },
  {
    id: 4,
    icon: FaStar,
    title: "Hall of Fame",
    description:
      "Past winners permanently featured in our winners archive.",
  },
  {
    id: 5,
    icon: FaCheck,
    title: "Always Free",
    description:
      "Zero entry fees. Participation is and always will be free.",
  },
  {
    id: 6,
    icon: FaGlobe,
    title: "Global Community",
    description:
      "Photographers from over 40 countries competing each month.",
  },
];

const Platform = () => {
  return (
    <section className="bg-white md:pb-section    sm:pb-12   pb-10">
      <div className="container mx-auto max-w-main px-5">

        {/* Section heading */}
        <div className="mb-4 text-center md:text-start">
          <p className=" mb-2 text-base font-bold uppercase tracking-wide text-blueText">
            The Platform
          </p>

          <h2 className=" text-xl font-extrabold text-titleText md:text-3xl ">
            Why My12Photos
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((feature) => (
            <div
              key={feature.id}
              className="rounded-xl border border-black/[0.17] bg-white p-3 transition-shadow duration-300 hover:shadow-md min-[400px]:p-4 sm:rounded-2xl sm:p-5"
            >
              {/* Feature icon */}
              <div className="mb-2 sm:mb-3">
                <IconDesign
                  icon={feature.icon}
                  color="#3F51B5"
                  bgColor="#EEF2FF"
                  size={12}
                />
              </div>

              {/* Feature content */}
              <h3 className="mb-1.5 text-sm font-bold text-[#111827] min-[400px]:text-base sm:mb-2 sm:text-lg md:text-xl">
                {feature.title}
              </h3>

              <p className="text-[11px] font-normal leading-relaxed text-subTitleText min-[400px]:text-xs sm:text-[13px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Platform;