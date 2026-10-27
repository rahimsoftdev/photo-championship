import { useLocation, useSearchParams } from "react-router";
import useArtwork from "../../hooks/useArtwork";
import ArtworkCard from "../../components/ui/ArtworkCard";
import Pagination from "../../components/shared/Pagination";
// import ArtworkSkeleton from "../../components/ui/Skeletons/ArtworkSkeleton";
import NoPhotosFound from "../../components/ui/NoPhotosFound";
import ArtworkSkeleton from "../../components/ui/Skeletons/ArtworkSkeleton";

const CompetitionPage = () => {
    // Read query params from the current URL.
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();

    const isFavorite = pathname === "/user-dashboard/favourite-photos";

    // Convert URL query params into an object for the custom hook.
    const params = Object.fromEntries(searchParams.entries());

    // Get filtered and paginated competition artworks.
    const {
        artworks,
        loading,
        error,
        totalPages,
    } = useArtwork(params, true, 9, '/artWork.json');

    // Show loading page while data is being fetched.
    if (loading) return <ArtworkSkeleton />;

    // Show an error if fetching fails.
    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <section className={`w-full space-y-6 ${!isFavorite && 'lg:pt-7'}`}>

            {isFavorite && (
                <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                    My Favorite Photos
                </h1>
            )}
            {/* <h1>Buy Photos</h1> */}

            {artworks.length === 0 ? (
                <NoPhotosFound />
            ) : (
                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
                    {artworks.map((artWorkData) => (
                        <ArtworkCard
                            key={artWorkData.id}
                            artWorkData={artWorkData}
                            isFavorite={isFavorite}
                        />
                    ))}
                </div>
            )}

            <Pagination totalPages={totalPages} />
        </section>
    );
};

export default CompetitionPage;
