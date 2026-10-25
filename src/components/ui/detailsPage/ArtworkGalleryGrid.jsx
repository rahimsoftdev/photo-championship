import React, { useState } from "react";
import { useSearchParams } from "react-router";
import {
  GiAries,
  GiTaurus,
  GiGemini,
  GiCancer,
  GiLeo,
  GiVirgo,
  GiLibra,
  GiScorpio,
  GiSagittarius,
  GiCapricorn,
  GiAquarius,
  GiPisces,
} from "react-icons/gi";

const RED = "#ef4444";
const BLUE = "#3b82f6";

// Smile-shape curve line. Dot gulo HTML element, tai SVG stretch holeo gol thake.
const Curve = ({ color, showStartDot = false, showEndDot = false }) => (
  <div className="relative h-7 w-full min-w-0 flex-1">
    <svg
      className="absolute inset-y-0 left-1 h-full w-[calc(100%-8px)] overflow-visible"
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 0,4 Q 50,34 100,4"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>

    {showStartDot && (
      <span
        className="absolute left-1 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: color, top: `${(4 / 28) * 100}%` }}
      />
    )}

    {showEndDot && (
      <span
        className="absolute right-1 size-2 translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: color, top: `${(4 / 28) * 100}%` }}
      />
    )}
  </div>
);

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
    <GiAries />,
    <GiTaurus />,
    <GiGemini />,
    <GiCancer />,
    <GiLeo />,
    <GiVirgo />,
    <GiLibra />,
    <GiScorpio />,
    <GiSagittarius />,
    <GiCapricorn />,
    <GiAquarius />,
    <GiPisces />,
  ];

  const defaultZodiacNames = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  const totalImages = images.length;

  // 6 ba tar kom hole ek row, 6 er beshi hole 12 layout
  const isTwelve = totalImages > 6;

  // Protita item er data ek jaygay (name, icon, color, selected state)
  const getItemData = (index) => {
    const isRedTheme = index < 6;

    return {
      imgUrl: images[index],
      isRedTheme,
      themeColor: isRedTheme ? RED : BLUE,
      lightColor: isRedTheme
        ? "rgba(254, 226, 226, 0.9)"
        : "rgba(219, 234, 254, 0.9)",
      zodiacName:
        zodiacs[index] || defaultZodiacNames[index] || `Item ${index + 1}`,
      ZodiacIconComponent: zodiacIcons[index] || zodiacIcons[0],
      isSelected: selectedIndex === index,
    };
  };

  // Thumbnail box: selected hole theme color border, na hole transparent
  const renderThumbnail = (data, aspectClass) => (
    <div
      className={`relative w-full overflow-hidden rounded-md border-2 transition-all duration-200 sm:rounded-lg ${aspectClass}`}
      style={{ borderColor: data.isSelected ? data.themeColor : "transparent" }}
    >
      <img
        src={data.imgUrl}
        alt={data.zodiacName}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );

  // Inline layout: upore [icon + name .... number], tarpor thumbnail
  const renderInlineItem = (index) => {
    const data = getItemData(index);

    return (
      <div
        key={index}
        onClick={() => handleImageSelect(index)}
        className="group flex min-w-0 cursor-pointer flex-col gap-1.5"
      >
        {/* Header row: icon + name bame, number badge dane */}
        <div className="flex min-w-0 items-center justify-between gap-1">
          <div className="flex min-w-0 items-center gap-1">
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] text-[10px] text-white sm:h-5 sm:w-5 sm:text-xs"
              style={{ backgroundColor: data.themeColor }}
            >
              {data.ZodiacIconComponent}
            </span>

            <span className="truncate text-[9px] font-medium text-gray-800 sm:text-xs">
              {data.zodiacName}
            </span>
          </div>

          <span
            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold sm:h-4 sm:w-4 sm:text-[9px]"
            style={{ backgroundColor: data.lightColor, color: data.themeColor }}
          >
            {index + 1}
          </span>
        </div>

        {renderThumbnail(data, "aspect-[3/2]")}
      </div>
    );
  };

  // Stacked layout (desktop 12 photo): number, icon, name, tarpor thumbnail
  const renderStackedItem = (index) => {
    const data = getItemData(index);

    return (
      <div
        key={index}
        onClick={() => handleImageSelect(index)}
        className="group flex min-w-0 cursor-pointer flex-col items-center gap-1.5 text-center"
      >
        {/* Number badge */}
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
          style={{ backgroundColor: data.lightColor, color: data.themeColor }}
        >
          {index + 1}
        </span>

        {/* Zodiac icon */}
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] text-xs text-white"
          style={{ backgroundColor: data.themeColor }}
        >
          {data.ZodiacIconComponent}
        </span>

        {/* Zodiac name */}
        <span className="max-w-full truncate px-0.5 text-[10px] font-medium text-gray-800 lg:text-[11px]">
          {data.zodiacName}
        </span>

        {renderThumbnail(data, "aspect-[4/5]")}
      </div>
    );
  };

  return (
    <div className="relative w-full pt-5 ">
      {/* 6 photo: ek ta curve + ek row */}
      {!isTwelve && (
        <div>
          <Curve color={RED} showStartDot showEndDot />

          <div className="mt-2 grid grid-cols-6 gap-2 sm:gap-3">
            {images.slice(0, 6).map((_, index) => renderInlineItem(index))}
          </div>
        </div>
      )}

      {/* 12 photo */}
      {isTwelve && (
        <>
          {/* Mobile/tablet: duto row, protita row er nijer curve */}
          <div className="space-y-5 md:hidden">
            <div>
              <Curve color={RED} showStartDot showEndDot />
              <div className="mt-2 grid grid-cols-6 gap-2 sm:gap-3">
                {images
                  .slice(0, 6)
                  .map((_, index) => renderInlineItem(index))}
              </div>
            </div>

            {totalImages > 6 && (
              <div>
                <Curve color={BLUE} showStartDot showEndDot />
                <div className="mt-2 grid grid-cols-6 gap-2 sm:gap-3">
                  {images
                    .slice(6, 12)
                    .map((_, i) => renderInlineItem(i + 6))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop: ek row e 12 ta, upore red + blue curve */}
          <div className="hidden md:block">
            <div className="flex gap-4">
              <Curve color={RED} showStartDot />
              <Curve color={BLUE} showEndDot />
            </div>

            <div className="mt-3 grid grid-cols-12 gap-2 lg:gap-3">
              {images.slice(0, 12).map((_, index) => renderStackedItem(index))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArtworkGalleryGrid;