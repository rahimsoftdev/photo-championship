import React from "react";
import { Link } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import AlbumCard from "../ui/AlbumCard";

/**
 * AlbumTypes Component: Fetches album data and displays
 * a fully responsive grid of competition cards.
 *
 * - isHome    : Home page er section design
 * - isArtwork : User dashboard er "Creative Upload Hub" design
 */
const AlbumTypes = ({ isHome, isArtwork, isAblum }) => {
  // Fetch album data using the custom useFetch hook
  const { data: albums, isLoading, error } = useFetch("/albumTypesData.json");

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

  /* ================= Artwork (Creative Upload Hub) ================= */
  if (isArtwork) {
    return (
      <div className="w-full">
        {/* Back link */}
        <Link
          to="/user-dashboard/artwork-management"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-800 sm:text-sm"
        >
          <FiArrowLeft size={16} className="shrink-0" />
          Back to Selection
        </Link>

        {/* Header */}
        <div className="mb-6 mt-4 sm:mb-8">
          <h2 className="font-manrope text-2xl font-extrabold leading-tight text-[#111827] sm:text-3xl">
            Creative Upload Hub
          </h2>
          <p className="mt-2 max-w-3xl font-manrope text-xs leading-relaxed text-[#6B7280] sm:text-sm">
            Select the competition tier you want to upload into. Each format offers a unique way to
            showcase your photographic vision.
          </p>
        </div>

        {/* Cards Grid
            (dashboard e sidebar er jonno content width kom, tai 3 column xl theke) */}
        <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-x-5 gap-y-7 pt-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {albums?.map((album) => (
            <div key={album.id} className="min-w-0">
              <AlbumCard album={album} isArtwork />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= Home / Default ================= */
  return (
    <div
      className={`w-full bg-[#F7F8FA] py-10 sm:py-12 md:py-14 lg:py-15 ${isHome | isAblum ? "xl:py-section" : ""}`}
    >
      <section className="mx-auto w-full max-w-main px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-8 w-full max-w-2xl text-center sm:mb-10 lg:mb-12">
          <span className="mb-2 block font-manrope text-xs font-bold uppercase tracking-[0.15em] text-[#E31837] sm:text-sm md:text-base">
            ACTIVE COMPETITIONS
          </span>

          <h2 className="mb-3 font-manrope text-xl font-extrabold leading-tight text-[#0D0D14] sm:mb-4 sm:text-2xl md:text-3xl">
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