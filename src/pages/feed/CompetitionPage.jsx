import { useSearchParams } from "react-router";
import { FiImage, FiLoader, FiAlertCircle } from "react-icons/fi";
import useArtwork from "../../hooks/useArtwork";
import ArtworkCard from "../../components/ui/ArtworkCard";

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
        <section className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
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
        </section>
    );
};

export default CompetitionPage;
