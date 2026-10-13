import React from 'react';
import { FaFire } from 'react-icons/fa';

const AboutMissionVision = () => {
  return (
    <section className="w-full py-12 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-main mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission Card */}
        <div className="bg-[#FDE8E9] rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-sm">
          <div>
            {/* Mission Heading */}
            <h3 className="text-[32px] md:text-[40px] font-extrabold text-[#0D0D14] mb-4">
              Our Mission
            </h3>
            
            {/* Mission Descriptions */}
            <p className="text-[18px] md:text-[20px] text-[#5B5B5B] font-normal leading-relaxed mb-4">
              Our mission is to inspire creativity by providing a modern, fair, and engaging photography competition platform where every photographer has an equal opportunity to be recognized.
            </p>
            <p className="text-[18px] md:text-[20px] text-[#5B5B5B] font-normal leading-relaxed mb-6">
              We aim to make photography competitions simple, transparent, and enjoyable while rewarding participants for their passion and creativity.
            </p>
          </div>

          {/* Bottom Highlight Text with Flame Icon */}
          <div className="flex items-center gap-2 text-[18px] md:text-[20px] font-semibold text-[#FD9400]">
            <FaFire className="w-5 h-5" />
            <span>Fair Play, Transparent Voting & High Engagement</span>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-[#FDE8E9] rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-sm">
          <div>
            {/* Vision Heading */}
            <h3 className="text-[32px] md:text-[40px] font-extrabold text-[#0D0D14] mb-4">
              Our Vision
            </h3>
            
            {/* Vision Descriptions */}
            <p className="text-[18px] md:text-[20px] text-[#5B5B5B] font-normal leading-relaxed mb-6">
              We aspire to become one of the world’s leading online photography competition platforms, connecting photographers from around the globe and building a vibrant community driven by creativity, recognition, and continuous participation.
            </p>
          </div>

          {/* Bottom Highlight Text with Flame Icon */}
          <div className="flex items-center gap-2 text-[18px] md:text-[20px] font-semibold text-[#FD9400]">
            <FaFire className="w-5 h-5" />
            <span>Connecting Photographers Worldwide</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutMissionVision;