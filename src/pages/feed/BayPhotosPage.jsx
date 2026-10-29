import { useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import useArtwork from "../../hooks/useArtwork";
import ArtworkCard from "../../components/ui/ArtworkCard";
import Pagination from "../../components/shared/Pagination";
import NoPhotosFound from "../../components/ui/NoPhotosFound";
import ArtworkSkeleton from "../../components/ui/Skeletons/ArtworkSkeleton";

const BayPhotosPage = () => {
    const sectionRef = useRef(null);

    const [searchParams] = useSearchParams();
    const previousParams = useRef(searchParams.toString());

    const params = Object.fromEntries(searchParams.entries());

    const {
        artworks,
        loading,
        error,
        totalPages,
    } = useArtwork(params, true, 9, "/bayPhoto.json");

    useEffect(() => {
        const currentParams = searchParams.toString();

        if (previousParams.current !== currentParams) {
            sectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }

        previousParams.current = currentParams;
    }, [searchParams]);

    return (
        <section
            ref={sectionRef}
            className="w-full space-y-6 lg:pt-2"
        >
            {loading ? (
                <ArtworkSkeleton />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    {artworks.length === 0 ? (
                        <NoPhotosFound />
                    ) : (
                        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
                            {artworks.map((artWorkData) => (
                                <ArtworkCard
                                    key={artWorkData.id}
                                    artWorkData={artWorkData}
                                />
                            ))}
                        </div>
                    )}

                    <Pagination totalPages={totalPages} />
                </>
            )}
        </section>
    );
};

export default BayPhotosPage;