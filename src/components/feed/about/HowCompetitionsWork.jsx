import React, { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

const stepsData = [
  {
    id: 1,
    title: "Create Your Account",
    shortDesc: "Sign for free and complete your proffesional profile...",
    fullDesc: "Sign up for free and complete your profile. Set up your personal gallery, link your photography socials, and tell the community about your artistic style."
  },
  {
    id: 2,
    title: "Choose Your Competition",
    shortDesc: "Select one of our competition categories...",
    fullDesc: "Browse through our diverse categories and select one of our competition categories that best fits your photography niche."
  },
  {
    id: 3,
    title: "Upload Your Work",
    shortDesc: "Submit your best photographs before the monthly deadline...",
    fullDesc: "Submit your best photographs before the monthly deadline. Ensure your files adhere to the submission guidelines for optimal voting performance."
  },
  {
    id: 4,
    title: "Receive Community Votes",
    shortDesc: "Your submission becomes available for public voting...",
    fullDesc: "Your submission becomes available for public voting. Share your entry link with friends, family, and social networks to gather momentum."
  },
  {
    id: 5,
    title: "Win Monthly Prizes",
    shortDesc: "Top-ranked photographers receive recognition, awards, and...",
    fullDesc: "Top-ranked photographers receive recognition, awards, cash prizes, and global exposure through our digital gallery showcase."
  }
];

export default function HowCompetitionsWork() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < stepsData.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const currentItem = stepsData[activeStep];

  return (
    <section className="bg-[#ECEDFA] py-section px-4 md:px-12 lg:px-20 min-h-screen flex flex-col items-center justify-center">
      
      {/* Top Header Section */}
      <div className="text-center max-w-main mb-12">
        <span className="text-primary uppercase tracking-widest text-xs font-bold block mb-2">
          HOW COMPETITIONS WORK
        </span>
        <h2 className="text-titleText text-3xl md:text-[48px] font-bold leading-tight mb-4">
          How Our Competitions Work
        </h2>
        <p className="text-subTitleText text-sm md:text-base">
          Follow our simple, streamlined timeline to submit your art, gather votes, and claim monthly recognition. Click each step below to learn more!
        </p>
      </div>

      {/* Main Container Layout */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Steps List */}
        <div className="flex flex-col gap-4">
          {stepsData.map((step, index) => {
            const isActive = activeStep === index;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`cursor-pointer bg-white rounded-xl p-5 transition-all duration-300 flex items-center gap-4 border ${
                  isActive ? 'shadow-md' : 'hover:border-primary/40'
                }`}
                style={{ borderColor: 'rgba(0, 0, 0, 0.17)' }}
              >
                {/* Count Box */}
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-titleText shrink-0"
                  style={{ backgroundColor: 'rgba(253, 232, 233, 1)' }}
                >
                  {step.id}
                </div>

                {/* Text Content */}
                <div className="overflow-hidden">
                  <h3 className="text-titleText font-bold text-base md:text-lg truncate">
                    {step.title}
                  </h3>
                  <p className="text-subTitleText text-xs md:text-sm truncate">
                    {step.shortDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Active Step Preview Card */}
        <div 
          className="bg-white rounded-2xl p-8 shadow-sm flex flex-col justify-between h-full min-h-[420px] border sticky top-10"
          style={{ borderColor: 'rgba(0, 0, 0, 0.17)' }}
        >
          <div>
            {/* Sub-card inside preview */}
            <div 
              className="p-4 rounded-xl mb-6 flex items-center gap-3"
              style={{ backgroundColor: 'rgba(253, 232, 233, 1)' }}
            >
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center font-semibold text-xs shadow-sm" style={{ color: '#FD9C00' }}>
                {currentItem.id}
              </div>
              <div>
                <span className="text-xs block font-medium" style={{ color: '#FD9C00' }}>
                  Step {currentItem.id} of {stepsData.length}
                </span>
                <h4 className="text-titleText font-bold text-lg">
                  {currentItem.title}
                </h4>
              </div>
            </div>

            {/* Description Paragraphs */}
            <p className="text-titleText font-medium text-base mb-3">
              {currentItem.fullDesc}
            </p>
            <p className="text-subTitleText text-sm leading-relaxed">
              Set up your personal gallery, link your photography socials, and tell the community about your artistic style.
            </p>
          </div>

          {/* Footer of the Card */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-8">
            <span className="text-xs text-subTitleText font-medium">
              Active Competition Mode
            </span>
            <button 
              onClick={handleNext}
              className="flex items-center gap-1 text-primary text-sm font-bold hover:underline"
            >
              <span>Next Step</span>
              <FiArrowRight />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}