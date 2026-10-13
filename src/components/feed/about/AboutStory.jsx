import React from 'react';
import storyImage from '../../../assets/images/story.jpg';

const AboutStory = () => {
  return (
    <section className="w-full py-section md:py-12 px-4 md:px-8 lg:px-16 bg-white">
      {/* Main container wrapper */}
      <div className="max-w-main mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        
        {/* Left Container: Story Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md lg:max-w-none">
            <img 
              src={storyImage} 
              alt="Our Story Landscape" 
              className="w-full h-auto max-h-[560px] rounded-2xl object-cover shadow-sm"
            />
          </div>
        </div>

        {/* Right Container: Text & Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          
          {/* Main Title Heading */}
          <h2 className="text-[36px] md:text-[48px] font-extrabold text-titleText leading-none mb-4">
            Our Story
          </h2>

          {/* Primary Paragraph */}
          <p className="text-[17px] md:text-[20px] text-[#5B5B5B] font-normal leading-relaxed mb-4">
            My12Photos was created with a simple idea—to give photographers of every skill level a place to showcase their creativity, tell visual stories, and gain recognition. Unlike traditional photo-sharing platforms, My12Photos brings photographers together through exciting monthly competitions, transparent voting, and a supportive global community.
          </p>

          {/* Secondary Paragraph */}
          <p className="text-[17px] md:text-[20px] text-[#5B5B5B] font-normal leading-relaxed mb-5">
            Whether you’re capturing breathtaking landscapes, unforgettable moments, or creative storytelling through albums, our platform helps your work reach a wider audience.
          </p>

          {/* Quote Section with Red Accent Line */}
          <div className="border-l-2 border-[#EE1C25] pl-4 italic">
            <p className="text-[15px] md:text-[18px] text-[#6B7280] leading-snug">
              "Every photographer should have a fair stage to present their visual timeline. We designed My12Photos as that global amphitheater."
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutStory;