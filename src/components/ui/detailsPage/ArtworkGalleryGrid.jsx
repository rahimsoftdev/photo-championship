import React, { useEffect, useState } from "react";
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

  return (
    <div className="w-full py-6 space-y-4 relative">
      {/* Curved Line Header Indicator (Full width responsive SVG) */}
      <div className="relative w-full h-8 hidden sm:block mb-2">
        {totalImages === 6 && (
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 30" preserveAspectRatio="none">
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
            {/* Red curve for first 6 */}
            <path
              d="M 10,25 Q 250,-5 495,25"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Blue curve for next 6 */}
            <path
              d="M 505,25 Q 750,-5 990,25"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="10" cy="25" r="4" fill="#ef4444" />
            <circle cx="990" cy="25" r="4" fill="#3b82f6" />
          </svg>
        )}
      </div>

      {/* Grid container: Strict 6 columns and max 2 rows, items shrink to fit without scrollbar */}
      <div className="grid grid-cols-6 grid-rows-2 gap-2 sm:gap-3 lg:gap-4 w-full">
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
              className="cursor-pointer group flex flex-col space-y-1 min-w-0"
            >
              {/* Top Details: Icon, Name & Circle Badge */}
              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <div className="flex items-center gap-1 overflow-hidden">
                  {/* Icon with soft background box */}
                  <span
                    className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded text-[10px] sm:text-xs text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    {ZodiacIconComponent}
                  </span>
                  <span className="font-medium text-gray-800 truncate text-[9px] sm:text-xs">
                    {zodiacName}
                  </span>
                </div>
                
                {/* Halka circle badge for index number */}
                <span
                  className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold"
                  style={{
                    backgroundColor: isRedTheme ? "rgba(254, 226, 226, 0.8)" : "rgba(219, 234, 254, 0.8)",
                    color: themeColor,
                  }}
                >
                  {index + 1}
                </span>
              </div>

              {/* Image Box with Active Border */}
              <div
                className={`relative overflow-hidden rounded-lg sm:rounded-xl aspect-[16/10] border-2 transition-all duration-200 ${
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