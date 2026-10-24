import React from 'react';
import { FiGlobe, FiAward } from 'react-icons/fi'; // React Icons theke icon import kora holo

// Image gulo import kore nite hobe (jodi src/components/feed/about/ theke src/assets/images/ e thake)
import CervidaeImg from '../../../assets/images/Cervidae.jpg';
import Community1Img from '../../../assets/images/community1.jpg';
import Community2Img from '../../../assets/images/community2.jpg';
import Community3Img from '../../../assets/images/community3.jpg';

const CommunitySection = () => {
  return (
    <section className="  py-10 sm:py-12 lg:py-section px-4 md:px-8 bg-white max-w-main mx-auto">
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text and Cards */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-titleText">
            Our Community
          </h2>
          <p className="text-subTitleText leading-relaxed text-xs sm:text-base md:text-lg">
            Our growing community consists of photographers, storytellers, hobbyists, and photography enthusiasts from around the world. Members can explore inspiring galleries, discover talented artists, participate in competitions, and celebrate each month's winners together.
          </p>
          <p className="text-subTitleText font-medium text-base sm:text-lg md:text-xl">
            We believe every photograph tells a story, and every story deserves an audience.
          </p>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            
            {/* Card 1 */}
            <div 
              className="p-5 rounded-2xl bg-white transition-all duration-300 hover:shadow-md"
              style={{ border: '1px solid rgba(0, 0, 0, 0.24)' }}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#33333A]">
                  <FiGlobe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-base sm:text-lg" style={{ color: '#33333A' }}>
                    Global Exchange
                  </h4>
                  <p className="text-xs md:text-base text-subTitleText mt-1">
                    Connect with visual minds across 150+ countries.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              className="p-5 rounded-2xl bg-white transition-all duration-300 hover:shadow-md"
              style={{ border: '1px solid rgba(0, 0, 0, 0.24)' }}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#33333A]">
                  <FiAward className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-base sm:text-lg" style={{ color: '#33333A' }}>
                    Empathetic Critique
                  </h4>
                  <p className="text-xs md:text-base text-subTitleText mt-1">
                    Acquire helpful reviews and votes from peers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Image Grid Layout */}
        <div className="grid grid-cols-2 gap-4 items-center">
          
          {/* Left Column of Images */}
          <div className="flex flex-col space-y-4">
            {/* Upore bame horiner image */}
            <div className="overflow-hidden rounded-2xl shadow-md h-56 sm:h-64">
              <img 
                src={CervidaeImg} 
                alt="Cervidae Deer" 
                className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
              />
            </div>
            {/* Horiner nice bamer image (community2.jpg) */}
            <div className="overflow-hidden rounded-2xl shadow-md h-64 sm:h-72">
              <img 
                src={Community2Img} 
                alt="Community 2" 
                className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Right Column of Images */}
          <div className="flex flex-col space-y-4 pt-8 sm:pt-12">
            {/* Daner uporer image (community1.jpg) */}
            <div className="overflow-hidden rounded-2xl shadow-md h-64 sm:h-72">
              <img 
                src={Community1Img} 
                alt="Community 1" 
                className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
              />
            </div>
            {/* Tar porer dane nicer image (community3.jpg) */}
            <div className="overflow-hidden rounded-2xl shadow-md h-56 sm:h-64">
              <img 
                src={Community3Img} 
                alt="Community 3" 
                className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CommunitySection;