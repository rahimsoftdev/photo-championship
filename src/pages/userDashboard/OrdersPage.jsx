import { useEffect, useMemo, useState } from "react";
import {
    FiAlertCircle,
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
    FiCreditCard,
    FiDollarSign,
    FiPercent,
    FiShoppingBag,
} from "react-icons/fi";
import { useOrders } from "../../hooks/useOrders";
import { updateOrderStatus } from "../../hooks/ordersStore";
import OrderRowMenu from "../../components/userDashbaord/ui/OrderRowMenu";
// import OrderRowMenu from "../../components/userDashbaord/OrderRowMenu";

// ⚠️ এখন হার্ডকোড। লগইন সিস্টেম থাকলে সেখান থেকে নিন।
const CURRENT_USER_ID = "user_104";
const PAGE_SIZE = 8;

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

/* ---------- হেল্পার ---------- */
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

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// তারিখ ফিল্টারের সীমা বের করে
const getRange = (key, from, to) => {
    const now = new Date();
    const today = startOfDay(now);

    if (key === "today") return [today, new Date(today.getTime() + 86400000 - 1)];
    if (key === "week") {
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        return [monday, new Date(monday.getTime() + 7 * 86400000 - 1)];
    }
    if (key === "month") {
        return [
            new Date(now.getFullYear(), now.getMonth(), 1),
            new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
        ];
    }
    if (key === "custom") {
        const start = from ? new Date(`${from}T00:00:00`) : null;
        const end = to ? new Date(`${to}T23:59:59.999`) : null;
        return [start, end];
    }
    return [null, null];
};

// স্ট্যাটাস অনুযায়ী commission/earnings (cancelled হলে ০)
const calc = (o) => {
    const cancelled = o.status === "cancelled";
    const commission = cancelled ? 0 : o.pricing.subtotal * o.pricing.commissionRate;
    return { commission, earnings: cancelled ? 0 : o.pricing.subtotal - commission };
};

/* ---------- ছোট UI অংশ ---------- */
const StatCard = ({ label, value, hint, icon: Icon, iconCls, highlight }) => (
    <div
        className={`rounded-2xl border bg-white p-4 ${
            highlight ? "border-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]" : "border-gray-200"
        }`}
    >
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
                <p className={`mt-2 text-2xl font-bold ${highlight ? "text-emerald-600" : "text-gray-900"}`}>
                    {value}
                </p>
                <p className="mt-1 text-[10px] text-gray-400">{hint}</p>
            </div>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconCls}`}>
                <Icon size={16} />
            </span>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const s = STATUS_BADGE[status] ?? STATUS_BADGE.processing;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${s.cls}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
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

const Th = ({ children, className = "" }) => (
    <th className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500 ${className}`}>
        {children}
    </th>
);

/* ---------- পেজ ---------- */
const OrdersPage = () => {
    const { orders, stats, counts, isLoading, error } = useOrders(CURRENT_USER_ID, "seller");

    const [statusTab, setStatusTab] = useState("all");
    const [dateTab, setDateTab] = useState(null); // null = সব তারিখ
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [sortAsc, setSortAsc] = useState(false); // false = নতুন আগে
    const [page, setPage] = useState(1);

    /* ফিল্টার */
    const filtered = useMemo(() => {
        const [start, end] = getRange(dateTab, customFrom, customTo);

        const list = orders.filter((o) => {
            if (statusTab !== "all" && o.status !== statusTab) return false;
            const placed = new Date(o.placedAt);
            if (start && placed < start) return false;
            if (end && placed > end) return false;
            return true;
        });

        return list.sort((a, b) =>
            sortAsc
                ? new Date(a.placedAt) - new Date(b.placedAt)
                : new Date(b.placedAt) - new Date(a.placedAt)
        );
    }, [orders, statusTab, dateTab, customFrom, customTo, sortAsc]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    // ফিল্টার বদলালে প্রথম পেজে ফিরে যাবে
    useEffect(() => {
        setPage(1);
    }, [statusTab, dateTab, customFrom, customTo]);

    // পেজ সংখ্যা কমে গেলে (যেমন স্ট্যাটাস বদলে) বাইরে থাকা পেজ ঠিক করা
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const toggleDate = (key) => setDateTab((prev) => (prev === key ? null : key));

    return (
        <div className="w-full space-y-5 pb-12">
            {/* হেডার */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="mt-1 text-xs text-gray-500">View and manage orders placed for your store products.</p>
            </div>

            {/* স্ট্যাটস কার্ড */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total Orders"
                    value={stats.totalOrders}
                    hint="All time across your store"
                    icon={FiShoppingBag}
                    iconCls="bg-gray-900 text-amber-300"
                />
                <StatCard
                    label="Total Sales"
                    value={money(stats.totalSales)}
                    hint="Gross revenue before fees"
                    icon={FiCreditCard}
                    iconCls="bg-sky-100 text-sky-600"
                />
                <StatCard
                    label="Platform Commission"
                    value={money(stats.commission)}
                    hint="Retained by LensArena"
                    icon={FiPercent}
                    iconCls="bg-amber-100 text-amber-600"
                />
                <StatCard
                    label="Your Earnings"
                    value={money(stats.earnings)}
                    hint="90% goes straight to you"
                    icon={FiDollarSign}
                    iconCls="bg-emerald-500 text-white"
                    highlight
                />
            </div>

            {/* ফিল্টার */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-gray-500">Status:</span>
                    {STATUS_TABS.map((t) => {
                        const active = statusTab === t.key;
                        return (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setStatusTab(t.key)}
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
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

                <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <FiCalendar size={12} /> Date:
                    </span>
                    {DATE_TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => toggleDate(t.key)}
                            className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                                dateTab === t.key
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom তারিখ */}
            {dateTab === "custom" && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-xs">
                    <label className="flex items-center gap-2 text-gray-600">
                        From
                        <input
                            type="date"
                            value={customFrom}
                            max={customTo || undefined}
                            onChange={(e) => setCustomFrom(e.target.value)}
                            className="rounded-md border border-gray-200 px-2 py-1 text-gray-800 outline-none focus:border-[#4048CD]"
                        />
                    </label>
                    <label className="flex items-center gap-2 text-gray-600">
                        To
                        <input
                            type="date"
                            value={customTo}
                            min={customFrom || undefined}
                            onChange={(e) => setCustomTo(e.target.value)}
                            className="rounded-md border border-gray-200 px-2 py-1 text-gray-800 outline-none focus:border-[#4048CD]"
                        />
                    </label>
                    {(customFrom || customTo) && (
                        <button
                            type="button"
                            onClick={() => {
                                setCustomFrom("");
                                setCustomTo("");
                            }}
                            className="font-medium text-[#4048CD] hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}

            {/* এরর */}
            {error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600"
                >
                    <FiAlertCircle size={15} className="shrink-0" />
                    {error}
                </div>
            )}

            {/* টেবিল */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[960px] text-left">
                        <thead className="bg-gray-50/70">
                            <tr>
                                <Th>Order ID</Th>
                                <Th>Customer</Th>
                                <Th>Product</Th>
                                <Th>
                                    <button
                                        type="button"
                                        onClick={() => setSortAsc((v) => !v)}
                                        className="inline-flex items-center gap-1 uppercase hover:text-gray-800"
                                        aria-label="Sort by date"
                                    >
                                        Date <span className="text-[9px]">{sortAsc ? "▲" : "▼"}</span>
                                    </button>
                                </Th>
                                <Th>Total</Th>
                                <Th>Admin 10%</Th>
                                <Th>Seller Earnings</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Action</Th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                            {!isLoading && !error && pageItems.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-14 text-center text-sm text-gray-400">
                                        No orders found for the selected filters.
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                pageItems.map((o) => {
                                    const { commission, earnings } = calc(o);
                                    const name = o.buyer?.name ?? o.shippingAddress.name;
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
                                                        <p className="max-w-[170px] truncate text-xs font-medium text-gray-900">
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
                                                    onStatusChange={updateOrderStatus}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {/* ফুটার: কাউন্ট ও পেজিনেশন */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
                    <p className="text-[11px] text-gray-500">
                        Showing <span className="font-semibold text-gray-800">{pageItems.length}</span> of{" "}
                        <span className="font-semibold text-gray-800">{filtered.length}</span> orders
                    </p>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            aria-label="Previous page"
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <FiChevronLeft size={14} />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setPage(i + 1)}
                                aria-current={page === i + 1 ? "page" : undefined}
                                className={`h-7 min-w-7 rounded-md border px-2 text-xs font-semibold transition ${
                                    page === i + 1
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            aria-label="Next page"
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <FiChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;