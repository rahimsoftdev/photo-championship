import { FiAlertCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSearchParams } from "react-router";
import OrderRowMenu from "./ui/OrderRowMenu";

/* ---------- হেল্পার ---------- */
const STATUS_BADGE = {
    processing: { label: "Processing", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
    shipped: { label: "Shipped", cls: "bg-purple-50 text-purple-700", dot: "bg-purple-500" },
    delivered: { label: "Delivered", cls: "bg-green-50 text-green-700", dot: "bg-green-500" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600", dot: "bg-red-500" },
};

const AVATAR_COLORS = [
    "bg-rose-100 text-rose-600",
    "bg-sky-100 text-sky-600",
    "bg-violet-100 text-violet-600",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-600",
    "bg-indigo-100 text-indigo-600",
];

const money = (n) =>
    `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const initials = (name = "") =>
    name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const colorFor = (name = "") =>
    AVATAR_COLORS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

// cancelled হলে commission/earnings ০
const calc = (o) => {
    const cancelled = o.status === "cancelled";
    const commission = cancelled ? 0 : o.pricing.subtotal * o.pricing.commissionRate;
    return { commission, earnings: cancelled ? 0 : o.pricing.subtotal - commission };
};

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

/* ---------- ছোট অংশ ---------- */
const StatusBadge = ({ status }) => {
    const s = STATUS_BADGE[status] ?? STATUS_BADGE.processing;
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${s.cls}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
};

const Th = ({ children, className = "" }) => (
    <th
        className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500 ${className}`}
    >
        {children}
    </th>
);

const Empty = () => (
    <div className="px-4 py-14 text-center text-sm text-gray-400">
        No orders found for the selected filters.
    </div>
);

const Pagination = ({ page, totalPages, showing, total, onPageChange }) => (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row">
        <p className="text-[11px] text-gray-500">
            Showing <span className="font-semibold text-gray-800">{showing}</span> of{" "}
            <span className="font-semibold text-gray-800">{total}</span> orders
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
                type="button"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <FiChevronLeft size={14} />
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
                        onClick={() => onPageChange(p)}
                        aria-current={page === p ? "page" : undefined}
                        className={`h-8 min-w-8 rounded-md border px-2 text-xs font-semibold transition ${
                            page === p
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                type="button"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <FiChevronRight size={14} />
            </button>
        </div>
    </div>
);

// মোবাইল ও ট্যাবলেটে টেবিলের বদলে কার্ড
const OrderCard = ({ order, onStatusChange }) => {
    const { commission, earnings } = calc(order);
    const name = order.buyer?.name ?? order.shippingAddress?.name ?? "Unknown";
    const cancelled = order.status === "cancelled";

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-mono text-[11px] font-bold text-gray-800">#{order.id}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">{formatDate(order.placedAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={order.status} />
                    <OrderRowMenu
                        orderId={order.id}
                        status={order.status}
                        onStatusChange={onStatusChange}
                    />
                </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
                <img
                    src={order.item.image}
                    alt={order.item.title}
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 object-cover"
                />
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{order.item.title}</p>
                    <p className="text-[11px] text-gray-400">Qty {order.item.quantity}</p>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
                <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${colorFor(
                        name
                    )}`}
                >
                    {initials(name)}
                </span>
                <span className="truncate text-xs text-gray-800">{name}</span>
            </div>

            <dl className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-center">
                <div>
                    <dt className="text-[10px] uppercase tracking-wide text-gray-500">Total</dt>
                    <dd
                        className={`mt-0.5 text-xs font-bold ${
                            cancelled ? "text-gray-400 line-through" : "text-gray-900"
                        }`}
                    >
                        {money(order.pricing.subtotal)}
                    </dd>
                </div>
                <div>
                    <dt className="text-[10px] uppercase tracking-wide text-gray-500">Admin 10%</dt>
                    <dd className="mt-0.5 text-xs text-gray-500">
                        {cancelled ? "—" : `−${money(commission)}`}
                    </dd>
                </div>
                <div>
                    <dt className="text-[10px] uppercase tracking-wide text-gray-500">Earnings</dt>
                    <dd className="mt-0.5 text-xs font-bold text-emerald-600">
                        {cancelled ? <span className="text-gray-400">—</span> : money(earnings)}
                    </dd>
                </div>
            </dl>
        </div>
    );
};

const SkeletonRow = () => (
    <tr className="animate-pulse border-t border-gray-100">
        {Array.from({ length: 9 }).map((_, i) => (
            <td key={i} className="px-4 py-4">
                <div className="h-3 w-full rounded bg-gray-200" />
            </td>
        ))}
    </tr>
);

const SkeletonCard = () => (
    <div className="animate-pulse space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="h-3 w-1/3 rounded bg-gray-200" />
        <div className="h-10 w-full rounded bg-gray-200" />
        <div className="h-8 w-full rounded bg-gray-200" />
    </div>
);

/* ---------- মূল কম্পোনেন্ট ---------- */
// lg+ এ টেবিল, তার নিচে কার্ড। sort ও page URL query তে বসে।
const OrdersTable = ({
    orders,
    total,
    page,
    totalPages,
    sort,
    isLoading,
    error,
    onStatusChange,
}) => {
    const [, setSearchParams] = useSearchParams();

    const setParam = (key, value, isDefault) =>
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (isDefault) next.delete(key);
                else next.set(key, String(value));
                if (key === "sort") next.delete("page");
                return next;
            },
            { replace: true }
        );

    const toggleSort = () => {
        const nextSort = sort === "asc" ? "desc" : "asc";
        setParam("sort", nextSort, nextSort === "desc");
    };

    const changePage = (p) => setParam("page", p, p === 1);

    const empty = !isLoading && !error && orders.length === 0;

    return (
        <div className="w-full">
            {error && (
                <div
                    role="alert"
                    className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600"
                >
                    <FiAlertCircle size={15} className="shrink-0" />
                    {error}
                </div>
            )}

            {/* মোবাইল / ট্যাবলেট: কার্ড */}
            <div className="lg:hidden">
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{total} orders</span>
                    <button
                        type="button"
                        onClick={toggleSort}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Date {sort === "asc" ? "▲ Oldest" : "▼ Newest"}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                    {!isLoading &&
                        orders.map((o) => (
                            <OrderCard key={o.id} order={o} onStatusChange={onStatusChange} />
                        ))}
                </div>

                {empty && (
                    <div className="rounded-xl border border-gray-200 bg-white">
                        <Empty />
                    </div>
                )}

                {!isLoading && total > 0 && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            showing={orders.length}
                            total={total}
                            onPageChange={changePage}
                        />
                    </div>
                )}
            </div>

            {/* ল্যাপটপ / ডেস্কটপ: টেবিল */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/70">
                            <tr>
                                <Th>Order ID</Th>
                                <Th>Customer</Th>
                                <Th>Product</Th>
                                <Th>
                                    <button
                                        type="button"
                                        onClick={toggleSort}
                                        className="inline-flex items-center gap-1 uppercase hover:text-gray-800"
                                        aria-label="Sort by date"
                                    >
                                        Date <span className="text-[9px]">{sort === "asc" ? "▲" : "▼"}</span>
                                    </button>
                                </Th>
                                <Th>Total</Th>
                                <Th>Admin 10%</Th>
                                <Th>Earnings</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Action</Th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                            {empty && (
                                <tr>
                                    <td colSpan={9}>
                                        <Empty />
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                orders.map((o) => {
                                    const { commission, earnings } = calc(o);
                                    const name = o.buyer?.name ?? o.shippingAddress?.name ?? "Unknown";
                                    const cancelled = o.status === "cancelled";

                                    return (
                                        <tr
                                            key={o.id}
                                            className="border-t border-gray-100 transition hover:bg-gray-50/60"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[11px] font-bold text-gray-800">
                                                #{o.id}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <span
                                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${colorFor(
                                                            name
                                                        )}`}
                                                    >
                                                        {initials(name)}
                                                    </span>
                                                    <span className="whitespace-nowrap text-xs text-gray-800">
                                                        {name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <img
                                                        src={o.item.image}
                                                        alt={o.item.title}
                                                        loading="lazy"
                                                        className="h-8 w-8 shrink-0 rounded-md bg-gray-100 object-cover"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="max-w-[160px] truncate text-xs font-medium text-gray-900 xl:max-w-[220px]">
                                                            {o.item.title}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400">
                                                            Qty {o.item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3.5 text-xs text-gray-500">
                                                {formatDate(o.placedAt)}
                                            </td>

                                            <td
                                                className={`whitespace-nowrap px-4 py-3.5 text-xs font-bold ${
                                                    cancelled ? "text-gray-400 line-through" : "text-gray-900"
                                                }`}
                                            >
                                                {money(o.pricing.subtotal)}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3.5 text-xs text-gray-400">
                                                {cancelled ? "—" : `−${money(commission)}`}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3.5">
                                                {cancelled ? (
                                                    <span className="text-xs text-gray-400">—</span>
                                                ) : (
                                                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                                                        {money(earnings)}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <StatusBadge status={o.status} />
                                            </td>

                                            <td className="px-4 py-3.5 text-right">
                                                <OrderRowMenu
                                                    orderId={o.id}
                                                    status={o.status}
                                                    onStatusChange={onStatusChange}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {!isLoading && total > 0 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        showing={orders.length}
                        total={total}
                        onPageChange={changePage}
                    />
                )}
            </div>
        </div>
    );
};

export default OrdersTable;