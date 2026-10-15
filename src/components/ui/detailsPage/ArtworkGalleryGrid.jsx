import React, { useState } from "react";
import { useSearchParams } from "react-router";
import { 
  GiAries, GiTaurus, GiGemini, GiCancer, GiLeo, GiVirgo, 
  GiLibra, GiScorpio, GiSagittarius, GiCapricorn, GiAquarius, GiPisces 
} from "react-icons/gi";

const ArtworkGalleryGrid = ({ images = [], zodiacs = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL query params theke initial index nia asha, na thakle 0
  const initialIndex = parseInt(searchParams.get("index")) || 0;
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex < images.length ? initialIndex : 0
  );

  // URL query params update korar handler
  const handleImageSelect = (index) => {
    setSelectedIndex(index);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("index", index);
      return newParams;
    });
  };

  // Jodi single photo (1 ta ba kom) hoy, tahole section ti dekhabe na
  if (!images || images.length <= 1) {
    return null;
  }

  // Zodiac icons mapping with react-icons
  const zodiacIcons = [
    <GiAries />, <GiTaurus />, <GiGemini />, <GiCancer />, <GiLeo />, <GiVirgo />,
    <GiLibra />, <GiScorpio />, <GiSagittarius />, <GiCapricorn />, <GiAquarius />, <GiPisces />
  ];

  const defaultZodiacNames = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const totalImages = images.length;
  // Jodi total images 6 ba tar kom hoy, tahole grid column 6 ta hobe (full width nibe), ar 12 ta hole 12 ta column hobe
  const gridColsClass = totalImages <= 6 ? "grid-cols-6" : "grid-cols-6 md:grid-cols-12";

  return (
    <div className="w-full py-6 space-y-4 relative">
      
      {/* Curved Line Indicator */}
      <div className="relative w-full h-8 mb-2">
        {totalImages <= 6 && (
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 30" preserveAspectRatio="none">
            {/* 6 images er khetre sobai er jonno upore bakano red line */}
            <path
              d="M 10,25 Q 500,-10 990,25"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="10" cy="25" r="4" fill="#ef4444" />
            <circle cx="990" cy="25" r="4" fill="#ef4444" />
          </svg>
        )}
        {totalImages >= 12 && (
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 30" preserveAspectRatio="none">
            {/* 12 images er khetre: Prothom 6 ta red line upore bakano */}
            <path
              d="M 10,25 Q 250,-5 495,25"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Porer 6 ta blue line niche bakano */}
            <path
              d="M 505,5 Q 750,35 990,5"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="10" cy="25" r="4" fill="#ef4444" />
            <circle cx="990" cy="5" r="4" fill="#3b82f6" />
          </svg>
        )}
      </div>

      {/* Grid container */}
      <div className={`grid ${gridColsClass} gap-2 sm:gap-3 w-full`}>
        {images.slice(0, 12).map((imgUrl, index) => {
          const isRedTheme = index < 6;
          const themeColor = isRedTheme ? "#ef4444" : "#3b82f6"; // Red or Blue
          
          const zodiacName = zodiacs[index] || defaultZodiacNames[index] || `Item ${index + 1}`;
          const ZodiacIconComponent = zodiacIcons[index] || zodiacIcons[0];

          const isSelected = selectedIndex === index;

          return (
            <div
              key={index}
              onClick={() => handleImageSelect(index)}
              className="cursor-pointer group flex flex-col items-center text-center space-y-1.5 min-w-0"
            >
              {/* 1. Sobr upore Count/Badge Number */}
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: isRedTheme ? "rgba(254, 226, 226, 0.8)" : "rgba(219, 234, 254, 0.8)",
                  color: themeColor,
                }}
              >
                {index + 1}
              </span>

              {/* 2. Tarpor Icon */}
              <span
                className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg text-xs sm:text-sm text-white shadow-sm"
                style={{ backgroundColor: themeColor }}
              >
                {ZodiacIconComponent}
              </span>

              {/* 3. Tarpor Name */}
              <span className="font-medium text-gray-800 truncate text-[10px] sm:text-xs max-w-full px-1">
                {zodiacName}
              </span>

              {/* 4. Sobr sheshe Image Box */}
              <div
                className={`relative overflow-hidden rounded-lg sm:rounded-xl aspect-[16/10] border-2 transition-all duration-200 w-full ${
                  isSelected ? "shadow-md" : "opacity-75 hover:opacity-100"
                }`}
                style={{
                  borderColor: isSelected ? themeColor : "transparent",
                }}
              >
                <img
                  src={imgUrl}
                  alt={zodiacName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtworkGalleryGrid;