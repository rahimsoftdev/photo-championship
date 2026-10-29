import { useLocation, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import useArtwork from "../../hooks/useArtwork";
import ArtworkCard from "../../components/ui/ArtworkCard";
import Pagination from "../../components/shared/Pagination";
// import ArtworkSkeleton from "../../components/ui/Skeletons/ArtworkSkeleton";
import NoPhotosFound from "../../components/ui/NoPhotosFound";
import ArtworkSkeleton from "../../components/ui/Skeletons/ArtworkSkeleton";

const CompetitionPage = () => {
    // Read query params from the current URL.
    const sectionRef = useRef(null);
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();

    const previousParams = useRef(searchParams.toString());

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


    return (
        <section
            ref={sectionRef}
            className={`w-full space-y-6 ${!isFavorite && "lg:pt-2"}`}
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
                                    isFavorite={isFavorite}
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

export default CompetitionPage;
