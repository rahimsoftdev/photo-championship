import React from "react";
import useFetch from "../../hooks/useFetch";
import AlbumCard from "../ui/AlbumCard";

/**
 * AlbumTypes Component: Fetches album data and displays
 * a fully responsive grid of competition cards.
 */
const AlbumTypes = () => {
  // Fetch album data using the custom useFetch hook
  const { data: albums, isLoading, error } = useFetch(
    "/albumTypesData.json"
  );

  // Loading state handler
  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <p className="text-center text-base font-manrope text-gray-500 sm:text-lg">
          Loading active competitions...
        </p>
      </div>
    );
  }

  // Error state handler
  if (error) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <p className="break-words text-center text-base font-manrope text-red-500 sm:text-lg">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Section Header */}
      <div className="mx-auto mb-8 w-full max-w-2xl text-center sm:mb-10 lg:mb-12">
        <span className="mb-2 block font-manrope text-sm font-bold uppercase tracking-widest text-[#E31837] sm:text-base">
          ACTIVE COMPETITIONS
        </span>

        <h2 className="mb-4 font-manrope text-3xl font-extrabold leading-tight text-[#0D0D14] sm:text-4xl sm:leading-tight md:text-[44px] lg:text-[48px] lg:leading-[48px]">
          Choose Your Album Type
        </h2>

        <p className="font-manrope text-sm font-normal leading-relaxed text-[#6B7280] sm:text-base md:text-lg lg:text-[20px] lg:leading-[29.25px]">
          Three competition album type. One goal: show your talent and win a prize.
        </p>
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {albums &&
          albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
      </div>
    </section>
  );
};

export default AlbumTypes;
