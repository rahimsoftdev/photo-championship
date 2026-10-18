import { useSearchParams } from "react-router";

const albumFilters = [
    { label: "All Artwork", value: "" },
    { label: "Single Photo", value: "single-photo" },
    { label: "6 Photo story", value: "6-photo-story" },
    { label: "12 Photos - Full Zodiac Story", value: "12-photos-full-zodiac-story" },
];

const MyArtworkFilter = ({ totalShown, totalFiltered }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentAlbum = searchParams.get("albumType") || "";

    const handleFilterChange = (value) => {
        const nextParams = new URLSearchParams(searchParams);
        if (value) {
            nextParams.set("albumType", value);
        } else {
            nextParams.delete("albumType");
        }
        nextParams.delete("page"); // Reset pagination
        setSearchParams(nextParams);
    };

    return (
        <div className="flex flex-col justify-between gap-4 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2" aria-label="Filter artworks by album type">
                {albumFilters.map((filter) => {
                    const isActive = currentAlbum === filter.value;

                    return (
                        <button
                            key={filter.label}
                            type="button"
                            onClick={() => handleFilterChange(filter.value)}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                                isActive
                                    ? "bg-primary text-white" // Updated to bg-primary
                                    : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#111827]"
                            }`}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>

            <div className="text-xs font-medium text-[#6B7280]">
                Showing <span className="text-[#111827] font-bold">{totalShown}</span> of <span className="text-[#111827] font-bold">{totalFiltered}</span> items
            </div>
        </div>
    );
};

export default MyArtworkFilter;