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
    <section className="bg-white py-section">
      <div className="container mx-auto max-w-main px-5">

        {/* Section heading */}
        <div className="mb-8">
          <p className="mb-2 text-base font-bold uppercase tracking-wide text-blueText">
            The Platform
          </p>

          <h2 className=" text-3xl font-extrabold text-titleText md:text-4xl mt-5">
            Why My12Photos
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((feature) => (
            <div
              key={feature.id}
              className="rounded-2xl border border-black/[0.17] bg-white p-5 transition-shadow duration-300 hover:shadow-md"
            >
              {/* Feature icon */}
              <div className="mb-3">
                <IconDesign
                  icon={feature.icon}
                  color="#3F51B5"
                  bgColor="#EEF2FF"
                  size={16}
                />
              </div>

              {/* Feature content */}
              <h3 className="mb-2 text-xl font-bold text-[#111827]">
                {feature.title}
              </h3>

              <p className="text-[13px] font-normal leading-relaxed text-subTitleText">
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