import { useSearchParams } from "react-router";
import { FaChevronDown } from "react-icons/fa";

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
        <div className="flex w-full min-w-0 flex-col gap-3 border-b border-[#E5E7EB] pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-4">
            {/* Small devices (< 640px): select dropdown */}
            <div className="relative w-full sm:hidden">
                <label htmlFor="album-filter" className="sr-only">
                    Filter artworks by album type
                </label>
                <select
                    id="album-filter"
                    value={currentAlbum}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-full appearance-none truncate rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] py-2 pl-3 pr-9 text-xs font-medium text-[#111827] transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    {albumFilters.map((filter) => (
                        <option key={filter.label} value={filter.value}>
                            {filter.label}
                        </option>
                    ))}
                </select>
                <FaChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6B7280]"
                />
            </div>

            {/* sm and up (>= 640px): pill buttons */}
            <div
                role="group"
                aria-label="Filter artworks by album type"
                className="hidden min-w-0 flex-wrap items-center gap-2 sm:flex"
            >
                {albumFilters.map((filter) => {
                    const isActive = currentAlbum === filter.value;

                    return (
                        <button
                            key={filter.label}
                            type="button"
                            onClick={() => handleFilterChange(filter.value)}
                            aria-pressed={isActive}
                            className={`max-w-full truncate rounded-full px-4 py-1.5 text-xs font-medium transition ${isActive
                                    ? "bg-primary text-white"
                                    : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#111827]"
                                }`}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>

            {/* Count */}
            <div className="text-[11px] font-medium text-[#6B7280] sm:flex-shrink-0 sm:whitespace-nowrap sm:text-xs">
                Showing <span className="font-bold text-[#111827]">{totalShown}</span> of{" "}
                <span className="font-bold text-[#111827]">{totalFiltered}</span> items
            </div>
        </div>
    );
};

export default MyArtworkFilter;