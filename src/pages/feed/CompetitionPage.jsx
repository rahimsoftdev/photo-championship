import { useSearchParams } from "react-router";
import { FiImage, FiLoader, FiAlertCircle } from "react-icons/fi";
import useArtwork from "../../hooks/useArtwork";

const CompetitionPage = () => {
  // Read query params from the current URL.
  const [searchParams] = useSearchParams();

  // Convert URL query params into an object for the custom hook.
  const params = Object.fromEntries(searchParams.entries());

  // true means this page will show competition-type artwork only.
  const {
    artworks,
    loading,
    error,
  } = useArtwork(params, true);

  // Total number of artworks matching the active filters.
  const totalArtworks = artworks.length;

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0D0D14] sm:text-3xl">
              Competition
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Explore and discover competition artworks.
            </p>
          </div>

          {/* Artwork count */}
          <div className="flex w-fit items-center gap-3 rounded-xl bg-[#4048CD]/10 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4048CD] text-white">
              <FiImage size={20} aria-hidden="true" />
            </div>

            <div>
              <p className="text-xs font-medium text-[#6B7280]">
                Total artworks
              </p>

              <p
                className="text-2xl font-bold leading-tight text-[#4048CD]"
                aria-live="polite"
              >
                {loading ? "—" : totalArtworks}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-gray-100" />

        {/* Loading state */}
        {loading && (
          <div
            className="flex min-h-40 flex-col items-center justify-center gap-3 text-[#6B7280]"
            role="status"
          >
            <FiLoader
              className="animate-spin text-[#4048CD]"
              size={28}
              aria-hidden="true"
            />

            <p className="text-sm">Loading competition artworks...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
            role="alert"
          >
            <FiAlertCircle
              className="mt-0.5 shrink-0 text-red-500"
              size={22}
              aria-hidden="true"
            />

            <div>
              <h2 className="font-semibold text-red-700">
                Failed to load artworks
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && totalArtworks === 0 && (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center">
            <FiImage
              className="mb-3 text-gray-400"
              size={32}
              aria-hidden="true"
            />

            <h2 className="text-base font-semibold text-[#0D0D14]">
              No artworks found
            </h2>

            <p className="mt-1 max-w-sm text-sm text-[#6B7280]">
              No competition artworks match your current search or filters.
              Try changing your search or selecting different filters.
            </p>
          </div>
        )}

        {/* Results summary */}
        {!loading && !error && totalArtworks > 0 && (
          <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#6B7280]">
              Found{" "}
              <span className="font-semibold text-[#0D0D14]">
                {totalArtworks}
              </span>{" "}
              {totalArtworks === 1 ? "artwork" : "artworks"} matching your
              filters.
            </p>

            <span className="w-fit rounded-full bg-[#4048CD]/10 px-3 py-1 text-xs font-semibold text-[#4048CD]">
              Competition only
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompetitionPage;
