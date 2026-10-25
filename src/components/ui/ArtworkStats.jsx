import { FiLayers, FiImage, FiGrid, FiAward } from "react-icons/fi";

const ArtworkStats = ({ counts = {} }) => {
    const {
        total = 0,
        single = 0,
        six = 0,
        twelve = 0,
        competition = 0,
    } = counts;

    const stats = [
        { label: "Total Artwork", value: total, icon: FiLayers, wide: true },
        { label: "Single Photos", value: single, icon: FiImage },
        { label: "6 Photo Albums", value: six, icon: FiGrid },
        { label: "12 Photo Albums", value: twelve, icon: FiGrid },
        { label: "Competition Entries", value: competition, icon: FiAward },
    ];

    return (
        // Mobile: 2 column (Total card full width), sm: 3 column, lg: 5 column
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {stats.map(({ label, value, icon: Icon, wide }) => (
                <div
                    key={label}
                    className={`flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-4 ${
                        wide ? "col-span-2 sm:col-span-1" : ""
                    }`}
                >
                    <div className="min-w-0">
                        <p className="truncate text-[11px] font-medium text-[#6B7280] sm:text-xs">
                            {label}
                        </p>
                        <p className="mt-1 text-xl font-bold text-[#111827] sm:mt-2 sm:text-2xl">
                            {value}
                        </p>
                    </div>
                    <div className="shrink-0 rounded-lg bg-gray-50 p-2 text-gray-600">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArtworkStats;