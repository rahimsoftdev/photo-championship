import { useSearchParams } from "react-router";
import useArtwork from "../../hooks/useArtwork";
import ArtworkCard from "../../components/ui/ArtworkCard";
import LoadingPage from "../feedback/LoadingPage";
import Pagination from "../../components/shared/Pagination";

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
    if (loading) return <LoadingPage />;

    // Show an error if fetching fails.
    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <section className="w-full space-y-6">
            {/* Artwork cards */}
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
                {artworks.map((artWorkData) => (
                    <ArtworkCard
                        key={
                            artWorkData.id ??
                            artWorkData._id ??
                            `${artWorkData.userId}-${artWorkData.title}`
                        }
                        artWorkData={artWorkData}
                    />
                ))}
            </div>

            {/* Pagination */}
             <Pagination  totalPages={totalPages} />
           
        </section>
    );
};

export default GalleryPage;
