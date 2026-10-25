import { useSearchParams } from "react-router";
import useArtwork from "../../hooks/useArtwork";
import ArtworkCard from "../../components/ui/ArtworkCard";
import Pagination from "../../components/shared/Pagination";
import ArtworkSkeleton from "../../components/ui/ArtworkSkeleton";

const BayPhotosPage = () => {
    const [searchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());

    const {
        artworks,
        loading,
        error,
        totalPages
    } = useArtwork(params, true, 9, "/bayPhoto.json");
    console.log(artworks, 'paichi')

    if (loading) return <ArtworkSkeleton/>;

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <section className="w-full space-y-6 lg:pt-7">
            {/* <h1>Buy Photos</h1> */}

            {artworks.length === 0 ? (
                <p>No photos found.</p>
            ) : (
                <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,280px),320px))] gap-4">
                    {artworks.map((artWorkData) => (
                        <ArtworkCard
                            key={artWorkData.id}
                            artWorkData={artWorkData}
                        />
                    ))}
                </div>
            )}

            <Pagination totalPages={totalPages}  />
        </section>
    );
};

export default BayPhotosPage;
