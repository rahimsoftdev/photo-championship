import React from "react";
import heroBg from "../../assets/images/herobg.png";
import SearchBar from "../ui/SearchBar";

// Hero section introducing the zodiac photography competition.
const Hero = () => {
  return (
    <section className="relative isolate flex  w-full items-center overflow-hidden bg-[#100d2b] sm:min-h-[620px] ">
      {/* Optimized background image */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />

      {/* Dark overlay keeps the text readable */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#100d2b]/80 via-[#100d2b]/40 to-[#100d2b]/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-b from-transparent to-white blur-[6px]" />
      {/* Hero content */}
      <div className="mx-auto w-full max-w-main px-5 py-16  ">
        <div className="max-w-3xl">
          {/* Competition badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/20 px-4 py-2 backdrop-blur-sm">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-[#05DF72]"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold text-white">
              Competitions live — July 2026
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-2xl font-semibold uppercase leading-[1.2] tracking-tight text-white min-[380px]:text-3xl min-[480px]:text-3xl md:text-[36px] lg:text-[40px] xl:text-5xl">
            Tell us your story using 12 photos same as the sun is telling us
            his using 12 signs of the zodiac
          </h1>

          {/* Supporting description */}
          <p className="mt-5 max-w-2xl text-base font-normal leading-relaxed text-white sm:text-lg lg:text-xl">
            Join over 12,000 photographers. Free competitions, community
            voting, cash prizes every month.
          </p>

          {/* Search bar component goes here */}
          <div className="mt-7 w-full max-w-[660px]">
            <SearchBar width="760px" isHero={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;