import { useSearchParams } from "react-router";
import useArtwork from "../../hooks/useArtwork";
import ArtworkCard from "../../components/ui/ArtworkCard";
import Pagination from "../../components/shared/Pagination";
// import ArtworkSkeleton from "../../components/ui/ArtworkSkeleton";
import NoPhotosFound from "../../components/ui/NoPhotosFound";
import ArtworkSkeleton from "../../components/ui/Skeletons/ArtworkSkeleton";

const GalleryPage = () => {
    // Read query params from the current URL.
    const [searchParams] = useSearchParams();

    // Convert URL query params into an object for the custom hook.
    const params = Object.fromEntries(searchParams.entries());

    // Get filtered and paginated competition artworks.
    const {
        artworks,
        loading,
        error,
        totalPages,
    } = useArtwork(params, false, 9, '/artWork.json');

    // Show loading page while data is being fetched.
    if (loading) return <ArtworkSkeleton />;

    // Show an error if fetching fails.
    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <section className="w-full space-y-6 lg:pt-7">
            {/* <h1>Buy Photos</h1> */}

            {artworks.length === 0 ? (
                <NoPhotosFound />
            ) : (
                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
                    {artworks.map((artWorkData) => (
                        <ArtworkCard
                            key={artWorkData.id}
                            artWorkData={artWorkData}
                        />
                    ))}
                </div>
            )}

            <Pagination totalPages={totalPages} />
        </section>
    );
};

export default GalleryPage;
