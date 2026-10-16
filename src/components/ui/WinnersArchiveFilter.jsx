import { useSearchParams } from "react-router";
import { FiCalendar, FiChevronDown, FiFolder } from "react-icons/fi";
// album type array for loop
const albumFilters = [
  {
    label: "All Entries",
    value: "",
  },
  {
    label: "Single Photo",
    value: "single-photo",
  },
  {
    label: "6 Photos",
    value: "6-photo-story",
  },
  {
    label: "12 Photos - Full Zodiac Story",
    value: "12-photos-full-zodiac-story",
  },
];
//month name in array formate
const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const WinnersArchiveFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedAlbum = searchParams.get("albumType") || "";
  const selectedMonth = searchParams.get("month") || "7";

  // Update URL while preserving other query parameters.
  const updateQueryParam = (key, value) => {
    setSearchParams((previousParams) => {
      const nextParams = new URLSearchParams(previousParams);

      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }

      // Reset pagination when filters change.
      nextParams.delete("page");

      return nextParams;
    });
  };

  return (
    <section className="w-full space-y-5">
      {/* Heading and month filter */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
            Complete Winners Archive
          </h1>

          <p className="mt-1 text-xs text-[#6B7280]">
            Review past legendary lens achievements, themes, and winning statistics.
          </p>
        </div>

        {/* Month dropdown */}
        <div className="relative shrink-0 self-start sm:self-auto">
          <FiCalendar
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
          />

          <select
            aria-label="Filter winners by month"
            value={selectedMonth}
            onChange={(event) =>
              updateQueryParam("month", event.target.value)
            }
            className="h-9 appearance-none rounded-lg border border-[#E5E7EB] bg-white py-2 pl-9 pr-9 text-xs font-medium text-[#374151] outline-none transition focus:border-[#4048CD]"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <FiChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
          />
        </div>
      </div>

      {/* Archive record information and album filters */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
          <FiFolder size={13} />

          <span className="font-medium uppercase tracking-wide">
            Historic Records:
          </span>

          <span className="text-[#374151]">7 Items</span>
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5"
          aria-label="Filter winners by album type"
        >
          {albumFilters.map((filter) => {
            const isActive = selectedAlbum === filter.value;

            return (
              <button
                key={filter.label}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  updateQueryParam("albumType", filter.value)
                }
                className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#4048CD] text-white"
                    : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#111827]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WinnersArchiveFilter;
