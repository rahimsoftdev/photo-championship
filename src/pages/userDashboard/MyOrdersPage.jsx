import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { FiAlertCircle, FiShoppingBag } from "react-icons/fi";
import { getSavedUserInfo } from "../../utils/getUserInof";
import { useOrders } from "../../hooks/useOrders";
import MyOrderStats from "../../components/userDashbaord/Myorderstats";
import MyOrderCard from "../../components/userDashbaord/Myordercard";
// import { useOrders } from "../../hooks/useOrders";
// import { getSavedUserInfo } from "../../utils/getUserInof";
// import MyOrderStats from "../../components/userDashboard/MyOrderStats";
// import MyOrderCard from "../../components/userDashboard/MyOrderCard";

const ROLE = "buyer";
const PAGE_SIZE = 3;

// বেশি পেজ হলে 1 … 4 5 6 … 20
const getPages = (page, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const nums = [...new Set([1, total, page - 1, page, page + 1])]
        .filter((n) => n >= 1 && n <= total)
        .sort((a, b) => a - b);
    const out = [];
    nums.forEach((n, i) => {
        if (i > 0 && n - nums[i - 1] > 1) out.push("…");
        out.push(n);
    });
    return out;
};

const SkeletonCard = () => (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="h-11 border-b border-gray-100 bg-gray-50" />
        <div className="flex gap-4 p-4">
            <div className="h-16 w-16 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2.5">
                <div className="h-3.5 w-1/2 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-2/5 rounded bg-gray-200" />
            </div>
        </div>
    </div>
);

const MyOrdersPage = () => {
    const userInfo = getSavedUserInfo();
    const userId = userInfo?.id;

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = Number(searchParams.get("page")) || 1;

    // URL এর ?page= → hook এ পাঠানো হবে
    const params = useMemo(() => ({ page: pageParam, pageSize: PAGE_SIZE }), [pageParam]);

    const { data, isLoading, error } = useOrders(userId, ROLE, params);
    const { orders, total, totalPages, page, counts } = data;

    const changePage = (p) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (p === 1) next.delete("page");
                else next.set("page", String(p));
                return next;
            },
            { replace: true }
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="w-full space-y-5 pb-12">
            <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">My Orders</h1>
                <p className="mt-1 text-xs text-gray-500">
                    View your purchases and track your orders across all creator mini-stores.
                </p>
            </div>

            <MyOrderStats counts={counts} isLoading={isLoading} />

            <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    Recent Orders (showing {orders.length} of {total})
                </p>
                <p className="text-[10px] text-gray-400">Sorted by newest placed</p>
            </div>

            {error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600"
                >
                    <FiAlertCircle size={15} className="shrink-0" />
                    {String(error)}
                </div>
            )}

            <div className="space-y-3">
                {isLoading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}

                {!isLoading && !error && orders.length === 0 && (
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-16 text-center text-gray-400">
                        <FiShoppingBag size={32} />
                        <p className="text-sm">You haven&apos;t placed any orders yet.</p>
                    </div>
                )}

                {!isLoading && orders.map((o) => <MyOrderCard key={o.id} order={o} />)}
            </div>

            {/* পেজিনেশন */}
            {!isLoading && total > 0 && (
                <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row">
                    <p className="text-[11px] text-gray-500">
                        Showing <span className="font-semibold text-gray-800">{orders.length}</span> of{" "}
                        <span className="font-semibold text-gray-800">{total}</span> purchases
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => changePage(page - 1)}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-[11px] font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        {getPages(page, totalPages).map((p, i) =>
                            p === "…" ? (
                                <span key={`dots-${i}`} className="px-1 text-xs text-gray-400">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => changePage(p)}
                                    aria-current={page === p ? "page" : undefined}
                                    className={`h-8 min-w-8 rounded-md border px-2 text-xs font-semibold transition ${
                                        page === p
                                            ? "border-emerald-600 bg-emerald-600 text-white"
                                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            disabled={page === totalPages}
                            onClick={() => changePage(page + 1)}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-[11px] font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;