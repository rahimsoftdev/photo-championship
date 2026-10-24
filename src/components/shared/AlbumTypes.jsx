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

    <div className="w-full bg-[#F7F8FA] py-10 sm:py-12 md:py-14 lg:py-section">
      <section className="mx-auto w-full max-w-main px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-8 w-full max-w-2xl text-center sm:mb-10 lg:mb-12">
          <span className="mb-2 block font-manrope text-xs font-bold uppercase tracking-[0.15em] text-[#E31837] sm:text-sm md:text-base">
            ACTIVE COMPETITIONS
          </span>

          <h2 className="mb-3 font-manrope text-2xl font-extrabold leading-tight text-[#0D0D14] sm:mb-4 sm:text-3xl md:text-4xl">
            Choose Your Album Type
          </h2>

          <p className="mx-auto max-w-xl font-manrope text-sm font-normal leading-relaxed text-[#6B7280] sm:text-base md:text-lg lg:text-xl">
            Three competition album types. One goal: show your talent and win a prize.
          </p>
        </div>

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-5 min-[350px]:grid-cols-[minmax(0,1fr)] min-[350px]:gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {albums?.map((album) => (
            <div key={album.id} className="min-w-0">
              <AlbumCard album={album} />
            </div>
          ))}
        </div>
      </section>
    </div>

  );
};

export default AlbumTypes;
