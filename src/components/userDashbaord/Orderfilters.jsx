import { FiCalendar } from "react-icons/fi";
import { useSearchParams } from "react-router";

const STATUS_TABS = [
    { key: "all", label: "All" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
];

const DATE_TABS = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "custom", label: "Custom" },
];

const scrollRow =
    "-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const OrderFilters = ({ params, counts }) => {
    const [, setSearchParams] = useSearchParams();
    const { status, date, from, to } = params;

    // URL এ query param বসায়। খালি মান হলে param মুছে যায়। ফিল্টার বদলালে page মুছে ১ এ ফেরে।
    const update = (updates) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                Object.entries(updates).forEach(([key, value]) => {
                    if (value) next.set(key, value);
                    else next.delete(key);
                });
                next.delete("page");
                return next;
            },
            { replace: true }
        );
    };

    // একই বাটনে দ্বিতীয়বার ক্লিক করলে unselect হয়ে "all" এ ফেরে
    const toggleStatus = (key) => {
        const unselect = key === "all" || status === key;
        update({ status: unselect ? "" : key });
    };

    // একই বাটনে দ্বিতীয়বার ক্লিক করলে তারিখ ফিল্টার উঠে যায়
    const toggleDate = (key) => {
        update({ date: date === key ? "" : key, from: "", to: "" });
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 text-[11px] text-gray-500">Status:</span>
                    <div className={scrollRow}>
                        {STATUS_TABS.map((t) => {
                            const active = status === t.key;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => toggleStatus(t.key)}
                                    className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                        active
                                            ? "border-[#4048CD] bg-[#4048CD] text-white"
                                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {t.label}
                                    <span
                                        className={`rounded-full px-1.5 text-[10px] ${
                                            active ? "bg-white/25" : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {counts[t.key] ?? 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex min-w-0 items-center gap-2">
                    <span className="flex shrink-0 items-center gap-1 text-[11px] text-gray-500">
                        <FiCalendar size={12} /> Date:
                    </span>
                    <div className={scrollRow}>
                        {DATE_TABS.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => toggleDate(t.key)}
                                className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                                    date === t.key
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {date === "custom" && (
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 text-xs sm:flex-row sm:flex-wrap sm:items-center">
                    <label className="flex items-center justify-between gap-2 text-gray-600 sm:justify-start">
                        From
                        <input
                            type="date"
                            value={from}
                            max={to || undefined}
                            onChange={(e) => update({ from: e.target.value })}
                            className="rounded-md border border-gray-200 px-2 py-1.5 text-gray-800 outline-none focus:border-[#4048CD]"
                        />
                    </label>
                    <label className="flex items-center justify-between gap-2 text-gray-600 sm:justify-start">
                        To
                        <input
                            type="date"
                            value={to}
                            min={from || undefined}
                            onChange={(e) => update({ to: e.target.value })}
                            className="rounded-md border border-gray-200 px-2 py-1.5 text-gray-800 outline-none focus:border-[#4048CD]"
                        />
                    </label>
                    {(from || to) && (
                        <button
                            type="button"
                            onClick={() => update({ from: "", to: "" })}
                            className="w-fit font-medium text-[#4048CD] hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderFilters;