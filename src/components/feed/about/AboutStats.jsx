import React from "react";
import Counter from "../../ui/Counter";

/**
 * AboutStats Component: Displays statistics inside a responsive card container 
 * using the project's max-w-main container size, border rgba(0, 0, 0, 0.2), and no inner dividers.
 */
const AboutStats = () => {
  return (
    <section className="w-full max-w-main mx-auto px-4 sm:px-6 lg:px-8 my-16">
      {/* Main Container Card with border rgba(0, 0, 0, 0.2) */}
      <div className="bg-white rounded-2xl shadow border border-[rgba(0,0,0,0.2)] p-6 sm:p-10">
        
        {/* Responsive Grid for Counters without dividers */}
        <div className="flex justify-between gap-8">
          
          {/* Stat 1: Zodiac Themes */}
          <div className="flex justify-center">
            <Counter value="12" suffix="+" label="Zodiac Themes" />
          </div>

          {/* Stat 2: Monthly Prizes */}
          <div className="flex justify-center">
            <Counter value="$10K" suffix="+" label="Monthly Prizes" />
          </div>

          {/* Stat 3: Voters Engaged */}
          <div className="flex justify-center">
            <Counter value="150K" suffix="+" label="Voters Engaged" />
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutStats;