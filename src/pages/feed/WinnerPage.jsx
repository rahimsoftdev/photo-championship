import { useSearchParams } from "react-router";

// Custom hook
import useWinnersArchive from "../../hooks/useWinnersArchive";

// UI components
import ArtworkCard from "../../components/ui/ArtworkCard";
import Pagination from "../../components/shared/Pagination";
import ArtworkSkeleton from "../../components/ui/Skeletons/ArtworkSkeleton";
import NoPhotosFound from "../../components/ui/NoPhotosFound";
import MyArtworkFilter from "../../components/ui/MyArtworkFilter";

const WinnerPage = () => {
  const [searchParams] = useSearchParams();

  const {
    artworks,
    totalArtworks,
    totalPages,
    loading,
    error,
  } = useWinnersArchive({
    albumType: searchParams.get("albumType") || "",
    month: searchParams.get("month") || "",
    page: searchParams.get("page") || "1",
  });

  return (
    <main className="mx-auto w-full max-w-main px-4 pt-6 sm:px-6 lg:px-8 sm:pt-12 lg:pt-15">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
          Complete Winners Archive
        </h1>

        <p className="mt-1 text-xs text-[#6B7280]">
          Review past legendary lens achievements, themes, and winning statistics.
        </p>
      </div>

      <MyArtworkFilter
        totalShown={artworks.length}
        totalFiltered={totalArtworks}
      />

      {error ? (
        <p className="mt-5 text-red-500">{error}</p>
      ) : loading ? (
        <div className="mt-5 md:mt-10">
          <ArtworkSkeleton />
        </div>
      ) : artworks.length === 0 ? (
        <NoPhotosFound />
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 xl:grid-cols-4">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id ?? artwork._id}
              artWorkData={artwork}
            />
          ))}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </main>
  );
};

export default WinnerPage;