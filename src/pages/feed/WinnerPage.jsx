import { useSearchParams } from "react-router";

// Custom hook
import useWinnersArchive from "../../hooks/useWinnersArchive";

// UI components
import ArtworkCard from "../../components/ui/ArtworkCard";
import WinnersArchiveFilter from "../../components/ui/WinnersArchiveFilter";
import Pagination from "../../components/shared/Pagination";

const WinnerPage = () => {
  // Read and update query parameters from the current URL.
  const [searchParams] = useSearchParams();

  // Extract query parameters and send them as one object to the hook.
  const {
    artworks,
    totalArtworks,
    totalPages,
    currentPage,
    loading,
    error,
  } = useWinnersArchive({
    albumType: searchParams.get("albumType") || "",
    month: searchParams.get("month") || "",
    page: searchParams.get("page") || "1",
  });

  return (
    <main className="mx-auto w-full max-w-main px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Archive heading, month selector, and album type filters */}
      <WinnersArchiveFilter />

      {/* Artwork count and current pagination information */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7280]">
        <p>
          <span className="font-semibold uppercase tracking-wide">
            Historic Records:
          </span>{" "}
          <span className="text-[#374151]">
            {loading ? "Loading..." : `${totalArtworks} items`}
          </span>
        </p>

        {!loading && !error && totalArtworks > 0 && (
          <p>
            Page{" "}
            <span className="font-semibold text-[#374151]">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#374151]">
              {totalPages}
            </span>
          </p>
        )}
      </div>

      {/* Show loading feedback while artwork data is being fetched */}
      {loading && (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-label="Loading winner artworks"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-xl border border-[#E5E7EB] bg-white"
            >
              {/* Image placeholder */}
              <div className="h-[205px] w-full bg-gray-200" />

              {/* Text placeholders */}
              <div className="space-y-3 p-3">
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-2/3 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show an error message if fetching fails */}
      {!loading && error && (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center"
        >
          <h2 className="text-base font-semibold text-red-700">
            Failed to load winners
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Render filtered artwork cards after successful loading */}
      {!loading && !error && artworks.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id ?? artwork._id}
              artWorkData={artwork}
            />
          ))}
        </div>
      )}

      {/* Show a helpful message when no artwork matches the filters */}
      {!loading && !error && artworks.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-[#D1D5DB] px-5 py-14 text-center">
          <h2 className="text-lg font-semibold text-[#111827]">
            No winners found
          </h2>

          <p className="mt-2 text-sm text-[#6B7280]">
            No artwork matches the selected month and album type.
            Try changing your filters.
          </p>
        </div>
      )}

      {/* Show pagination only when multiple pages are available */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-7">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </main>
  );
};

export default WinnerPage;
