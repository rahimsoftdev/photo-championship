// Orders ও My Orders — দুই পেজেই লোডিংয়ের সময় এই একটাই স্কেলেটন দেখাবে।

const Bar = ({ className = "" }) => <div className={`rounded bg-gray-200 ${className}`} />;

const StatSkeleton = () => (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
                <Bar className="h-2.5 w-20" />
                <Bar className="mt-3 h-7 w-24" />
                <Bar className="mt-2 h-2.5 w-28 max-w-full" />
            </div>
            <Bar className="h-9 w-9 shrink-0 rounded-lg" />
        </div>
    </div>
);

const RowSkeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* হেডার */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-4 py-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <Bar className="h-3 w-28" />
                <Bar className="hidden h-3 w-40 sm:block" />
            </div>
            <Bar className="h-6 w-20 shrink-0 rounded-full" />
        </div>

        {/* বডি */}
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="flex min-w-0 items-center gap-4 lg:flex-1">
                <Bar className="h-16 w-16 shrink-0 rounded-lg sm:h-[72px] sm:w-[72px]" />
                <div className="min-w-0 flex-1 space-y-2.5">
                    <Bar className="h-3.5 w-3/5" />
                    <Bar className="h-3 w-2/5" />
                    <Bar className="h-3 w-1/2" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3 lg:flex lg:items-center lg:gap-8 lg:border-0 lg:pt-0">
                {[0, 1, 2].map((i) => (
                    <div key={i} className={`space-y-2 ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
                        <Bar className="h-2 w-14" />
                        <Bar className="h-3.5 w-20" />
                        <Bar className="h-2 w-16" />
                    </div>
                ))}
            </div>

            <Bar className="h-10 w-full shrink-0 rounded-lg lg:w-40" />
        </div>
    </div>
);

/**
 * @param {number} rows  কয়টা অর্ডার সারি দেখাবে (ডিফল্ট ৪)
 */
const OrdersSkeleton = ({ rows = 4 }) => (
    <div className="w-full animate-pulse space-y-5 pb-12" role="status" aria-busy="true" aria-label="Loading orders">
        {/* শিরোনাম */}
        <div>
            <Bar className="h-7 w-40" />
            <Bar className="mt-2 h-3 w-72 max-w-full" />
        </div>

        {/* স্ট্যাটস কার্ড */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <StatSkeleton key={i} />
            ))}
        </div>

        {/* ফিল্টার */}
        <div className="flex gap-2 overflow-hidden">
            {["w-16", "w-24", "w-20", "w-24", "w-20"].map((w, i) => (
                <Bar key={i} className={`h-8 shrink-0 rounded-full ${w}`} />
            ))}
        </div>

        {/* অর্ডার তালিকা */}
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <RowSkeleton key={i} />
            ))}
        </div>

        <span className="sr-only">Loading orders…</span>
    </div>
);

export default OrdersSkeleton;