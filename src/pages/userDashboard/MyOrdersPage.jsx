import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    FiAlertCircle,
    FiArrowRight,
    FiCalendar,
    FiCheck,
    FiCheckCircle,
    FiClock,
    FiCopy,
    FiShoppingBag,
    FiTruck,
} from "react-icons/fi";
import { useOrders } from "../../hooks/useOrders";

// ⚠️ এখন হার্ডকোড। লগইন সিস্টেম থাকলে সেখান থেকে নিন।
const CURRENT_USER_ID = "user_103";
const PAGE_SIZE = 3;
const DETAILS_PATH = "/userDashboard/my-orders";

const STATUS_BADGE = {
    processing: { label: "Processing", cls: "border-amber-200 bg-amber-50 text-amber-700", dot: "bg-amber-500" },
    shipped: { label: "Shipped", cls: "border-purple-200 bg-purple-50 text-purple-700", dot: "bg-purple-500" },
    delivered: { label: "Delivered", cls: "border-green-200 bg-green-50 text-green-700", dot: "bg-green-500" },
    cancelled: { label: "Cancelled", cls: "border-red-200 bg-red-50 text-red-600", dot: "bg-red-500" },
};

/* ---------- হেল্পার ---------- */
const money = (n) =>
    `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtLong = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const fmtShort = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// "Sep 18–20" বা মাস আলাদা হলে "Sep 28 – Oct 2"
const fmtRange = (from, to) => {
    const a = new Date(from);
    const b = new Date(to);
    const month = (d) => d.toLocaleDateString("en-US", { month: "short" });
    return month(a) === month(b)
        ? `${month(a)} ${a.getDate()}–${b.getDate()}`
        : `${fmtShort(from)} – ${fmtShort(to)}`;
};

const paymentText = (pm) => (pm.last4 ? `${pm.brand} •••• ${pm.last4}` : pm.brand);

/* ---------- ছোট UI অংশ ---------- */
const StatCard = ({ label, value, hint, icon: Icon, tone }) => {
    const tones = {
        gray: { box: "border-gray-200", label: "text-gray-500", icon: "bg-gray-100 text-gray-600", hint: "text-gray-500" },
        amber: { box: "border-amber-200", label: "text-amber-600", icon: "bg-amber-50 text-amber-500", hint: "text-amber-600" },
        purple: { box: "border-purple-200", label: "text-purple-600", icon: "bg-purple-50 text-purple-500", hint: "text-purple-600" },
        green: { box: "border-emerald-200", label: "text-emerald-600", icon: "bg-emerald-50 text-emerald-500", hint: "text-emerald-600" },
    }[tone];

    return (
        <div className={`flex items-start justify-between rounded-2xl border bg-white p-4 ${tones.box}`}>
            <div>
                <p className={`text-[10px] font-bold uppercase tracking-wide ${tones.label}`}>{label}</p>
                <p className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                    <span className={`text-[11px] ${tones.hint}`}>{hint}</span>
                </p>
            </div>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones.icon}`}>
                <Icon size={15} />
            </span>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const s = STATUS_BADGE[status] ?? STATUS_BADGE.processing;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${s.cls}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
};

const Meta = ({ label, children, sub, subCls = "text-gray-400" }) => (
    <div className="min-w-[90px]">
        <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
        <div className="mt-1 text-xs font-bold text-gray-900">{children}</div>
        {sub && <p className={`mt-0.5 text-[10px] ${subCls}`}>{sub}</p>}
    </div>
);

const CopyId = ({ id }) => {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(id);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* ক্লিপবোর্ড বন্ধ থাকলে কিছু করার নেই */
        }
    };
    return (
        <button
            type="button"
            onClick={copy}
            aria-label="Copy order ID"
            className="text-gray-400 transition hover:text-gray-700"
        >
            {copied ? <FiCheck size={12} className="text-emerald-500" /> : <FiCopy size={12} />}
        </button>
    );
};

const SkeletonCard = () => (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4">
        <div className="h-3 w-1/3 rounded bg-gray-200" />
        <div className="mt-4 flex gap-4">
            <div className="h-16 w-16 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-200" />
            </div>
        </div>
    </div>
);

/* ---------- অর্ডার কার্ড ---------- */
const OrderCard = ({ o }) => {
    const { item, pricing, seller } = o;
    const storeName = seller?.store?.name ?? seller?.name ?? "Creator Store";
    const verified = seller?.store?.verified;
    const cancelled = o.status === "cancelled";

    // Delivery কলামের লেখা
    let delivery = "—";
    let deliverySub = "";
    if (o.status === "delivered") {
        delivery = "Delivered";
        deliverySub = o.deliveredAt ? fmtShort(o.deliveredAt) : "";
    } else if (cancelled) {
        delivery = "Cancelled";
        deliverySub = "Refund issued";
    } else if (o.estimatedDelivery) {
        delivery = `Est. ${fmtRange(o.estimatedDelivery.from, o.estimatedDelivery.to)}`;
    }

    const shipText = pricing.shipping > 0 ? `includes ${money(pricing.shipping)} ship` : "Free Shipping";

    return (
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* হেডার */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-gray-900">
                        Order #{o.id} <CopyId id={o.id} />
                    </span>
                    <span className="hidden h-3 w-px bg-gray-200 sm:block" />
                    <span className="flex items-center gap-1.5 text-gray-500">
                        <FiCalendar size={12} /> Placed on {fmtLong(o.placedAt)}
                    </span>
                </div>
                <StatusBadge status={o.status} />
            </div>

            {/* বডি */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
                        <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            Qty: {item.quantity}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-900">{item.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                            Sold by: <span className="font-semibold text-gray-800">{storeName}</span>
                            {verified && <FiCheckCircle size={11} className="text-sky-500" aria-label="Verified" />}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                            Quantity: {item.quantity} <span className="mx-1">•</span> Item Price:{" "}
                            {money(item.unitPrice)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                    <Meta
                        label="Order Total"
                        sub={cancelled ? "Refunded" : shipText}
                        subCls={!cancelled && pricing.shipping === 0 ? "text-emerald-600" : "text-gray-400"}
                    >
                        {money(pricing.totalPaid)}
                    </Meta>

                    <Meta label="Payment" sub={paymentText(o.paymentMethod)}>
                        <span className={o.paymentStatus === "paid" ? "text-emerald-600" : "text-gray-600"}>
                            {o.paymentStatus === "paid" ? "✓ Paid" : "Refunded"}
                        </span>
                    </Meta>

                    <Meta label="Delivery" sub={deliverySub}>
                        <span className={o.status === "delivered" ? "text-emerald-600" : "text-gray-900"}>
                            {delivery}
                        </span>
                    </Meta>

                    <Link
                        to={`${DETAILS_PATH}/${o.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1c1c1e] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
                    >
                        View Order Details <FiArrowRight size={13} />
                    </Link>
                </div>
            </div>
        </article>
    );
};

/* ---------- পেজ ---------- */
const MyOrdersPage = () => {
    const { orders, counts, isLoading, error } = useOrders(CURRENT_USER_ID, "buyer");
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const pageItems = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="w-full space-y-5 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <p className="mt-1 text-xs text-gray-500">
                    View your purchases and track your orders across all creator mini-stores.
                </p>
            </div>

            {/* কার্ড */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Orders" value={counts.all} hint="All time" icon={FiShoppingBag} tone="gray" />
                <StatCard label="Processing" value={counts.processing} hint="In preparation" icon={FiClock} tone="amber" />
                <StatCard label="Shipped" value={counts.shipped} hint="On the road" icon={FiTruck} tone="purple" />
                <StatCard label="Delivered" value={counts.delivered} hint="Completed" icon={FiCheckCircle} tone="green" />
            </div>

            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    Recent Orders (showing {pageItems.length} of {orders.length})
                </p>
                <p className="text-[10px] text-gray-400">Sorted by newest placed</p>
            </div>

            {error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600"
                >
                    <FiAlertCircle size={15} className="shrink-0" />
                    {error}
                </div>
            )}

            <div className="space-y-3">
                {isLoading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}

                {!isLoading && !error && orders.length === 0 && (
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white py-16 text-gray-400">
                        <FiShoppingBag size={32} />
                        <p className="text-sm">You haven&apos;t placed any orders yet.</p>
                    </div>
                )}

                {!isLoading && pageItems.map((o) => <OrderCard key={o.id} o={o} />)}
            </div>

            {/* পেজিনেশন */}
            {!isLoading && orders.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <p className="text-[11px] text-gray-500">
                        Showing <span className="font-semibold text-gray-800">{pageItems.length}</span> of{" "}
                        <span className="font-semibold text-gray-800">{orders.length}</span> purchases
                    </p>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setPage(i + 1)}
                                aria-current={page === i + 1 ? "page" : undefined}
                                className={`h-7 min-w-7 rounded-md border px-2 text-xs font-semibold transition ${
                                    page === i + 1
                                        ? "border-emerald-600 bg-emerald-600 text-white"
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
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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