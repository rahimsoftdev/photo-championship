import React, { useState } from 'react';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaTrophy, 
  FaCalendarAlt, 
  FaArrowRight, 
  FaHeart 
} from 'react-icons/fa';
import { HiFire } from 'react-icons/hi';

const bannerData = [
  {
    id: 1,
    title: "August International Photography Competition 2026",
    subtitle: '"Summer Sunset in Tatra"',
    image: "https://picsum.photos/seed/competition-1/600/400",
    uploadedDate: "Aug 05, 2026",
    status: "CURRENTLY IN COMPETITION",
    votes: 342,
    rank: "#12",
    votingEnds: "Aug 31, 2026"
  },
  {
    id: 2,
    title: "Nature & Wildlife Photography Contest",
    subtitle: '"The Wilderness Unleashed"',
    image: "https://picsum.photos/seed/competition-2/600/400",
    uploadedDate: "Aug 10, 2026",
    status: "CURRENTLY IN COMPETITION",
    votes: 512,
    rank: "#05",
    votingEnds: "Sep 15, 2026"
  }
];

const CompetitionBannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? bannerData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === bannerData.length - 1 ? 0 : prev + 1));
  };

  const currentBanner = bannerData[currentIndex];

  return (
    <div className="relative w-full my-6">
      {/* Slide Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 text-gray-700 transition"
      >
        <FaChevronLeft className="text-xs" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 text-gray-700 transition"
      >
        <FaChevronRight className="text-xs" />
      </button>

      {/* Main Banner Card */}
      <div className="bg-[#1E293B] text-white rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl overflow-hidden relative">
        
        {/* Banner Left Image */}
        <div className="w-full md:w-2/5 h-48 md:h-56 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-800">
          <img 
            src={currentBanner.image} 
            alt={currentBanner.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Banner Right Details */}
        <div className="w-full md:w-3/5 flex flex-col justify-between h-full space-y-4">
          
          {/* Top Status Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider">
                <FaTrophy className="text-xs" /> {currentBanner.status}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <FaCalendarAlt className="text-gray-500" /> Uploaded {currentBanner.uploadedDate}
              </span>
            </div>

            <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md transition">
              <FaHeart className="text-xs" /> Cast Your Vote
            </button>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              {currentBanner.title}
            </h2>
            <p className="text-xs text-gray-400 italic mt-1">{currentBanner.subtitle}</p>
          </div>

          {/* Stats & Details Bottom Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs">
                <HiFire className="text-rose-500 text-sm" />
                <span className="font-bold">{currentBanner.votes}</span>
                <span className="text-gray-400 text-[11px]">Votes</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs">
                <FaTrophy className="text-amber-400 text-xs" />
                <span className="text-gray-400 text-[11px]">Rank</span>
                <span className="font-bold text-amber-300">{currentBanner.rank}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-400">
                Voting ends: <strong className="text-gray-200">{currentBanner.votingEnds}</strong>
              </span>

              <a href="#" className="text-gray-300 hover:text-white flex items-center gap-1 text-xs font-medium hover:underline">
                Inspect Entry Details <FaArrowRight className="text-[10px]" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CompetitionBannerCarousel;