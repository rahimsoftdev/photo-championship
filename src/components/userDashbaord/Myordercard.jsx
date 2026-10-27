import { useState } from "react";
import { Link } from "react-router";
import { FiArrowRight, FiCalendar, FiCheck, FiCheckCircle, FiCopy } from "react-icons/fi";

const DETAILS_PATH = "/user-dashboard/my-orders";

const STATUS_BADGE = {
    processing: { label: "Processing", cls: "border-amber-200 bg-amber-50 text-amber-700", dot: "bg-amber-500" },
    shipped: { label: "Shipped", cls: "border-purple-200 bg-purple-50 text-purple-700", dot: "bg-purple-500" },
    delivered: { label: "Delivered", cls: "border-green-200 bg-green-50 text-green-700", dot: null },
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

const paymentText = (pm) => {
    if (!pm) return "";
    const name = pm.brand ?? pm.type ?? "";
    return pm.last4 ? `${name} •••• ${pm.last4}` : name;
};

/* ---------- ছোট অংশ ---------- */
const StatusBadge = ({ status }) => {
    const s = STATUS_BADGE[status] ?? STATUS_BADGE.processing;
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${s.cls}`}
        >
            {s.dot ? <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> : <FiCheck size={11} />}
            {s.label}
        </span>
    );
};

const Meta = ({ label, children, sub, subCls = "text-gray-400" }) => (
    <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
        <div className="mt-1 text-sm font-bold text-gray-900">{children}</div>
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

/* ---------- অর্ডার কার্ড ---------- */
const MyOrderCard = ({ order: o }) => {
    const { item, pricing, seller } = o;
    const storeName = seller?.store?.name ?? seller?.name ?? "Creator Store";
    const verified = seller?.store?.verified;
    const cancelled = o.status === "cancelled";
    const delivered = o.status === "delivered";

    // Delivery কলামের লেখা
    let delivery = "—";
    let deliverySub = "";
    if (delivered) {
        delivery = "Delivered";
        deliverySub = o.deliveredAt ? fmtShort(o.deliveredAt) : "";
    } else if (cancelled) {
        delivery = "Cancelled";
        deliverySub = "Refund issued";
    } else if (o.estimatedDelivery?.from) {
        delivery = `Est. ${fmtRange(o.estimatedDelivery.from, o.estimatedDelivery.to)}`;
    }

    const shipText = pricing.shipping > 0 ? `Includes ${money(pricing.shipping)} ship` : "Free Shipping";

    return (
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* হেডার */}
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-gray-100 bg-gray-50/60 px-4 py-3">
                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-gray-900">
                        Order #{o.id} <CopyId id={o.id} />
                    </span>
                    <span className="hidden h-3 w-px bg-gray-300 sm:block" />
                    <span className="flex items-center gap-1.5 text-gray-500">
                        <FiCalendar size={12} /> Placed on {fmtLong(o.placedAt)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <StatusBadge status={o.status} />
                    {delivered && o.deliveredAt && (
                        <span className="hidden text-[10px] text-gray-400 sm:inline">
                            Delivered on {fmtShort(o.deliveredAt)}
                        </span>
                    )}
                </div>
            </div>

            {/* বডি */}
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                {/* প্রোডাক্ট */}
                <div className="flex min-w-0 items-center gap-4 lg:flex-1">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-[72px] sm:w-[72px]">
                        <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
                        <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            Qty: {item.quantity}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">{item.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                            Sold by: <span className="truncate font-semibold text-gray-800">{storeName}</span>
                            {verified && (
                                <FiCheckCircle size={11} className="shrink-0 text-sky-500" aria-label="Verified" />
                            )}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                            Quantity: {item.quantity} <span className="mx-1">•</span> Item Price:{" "}
                            {money(item.unitPrice)} ea
                        </p>
                    </div>
                </div>

                {/* তথ্য কলাম */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3 lg:flex lg:items-center lg:gap-8 lg:border-l lg:border-t-0 lg:px-6 lg:pt-0">
                    <Meta
                        label="Order Total"
                        sub={cancelled ? "Refunded" : shipText}
                        subCls={!cancelled && pricing.shipping === 0 ? "text-emerald-600" : "text-gray-400"}
                    >
                        {money(pricing.totalPaid)}
                    </Meta>

                    <Meta label="Payment" sub={paymentText(o.paymentMethod)}>
                        <span
                            className={`inline-flex items-center gap-1 ${
                                o.paymentStatus === "paid" ? "text-emerald-600" : "text-gray-600"
                            }`}
                        >
                            {o.paymentStatus === "paid" ? (
                                <>
                                    <FiCheckCircle size={12} /> Paid
                                </>
                            ) : (
                                "Refunded"
                            )}
                        </span>
                    </Meta>

                    <div className="col-span-2 sm:col-span-1">
                        <Meta label="Delivery" sub={deliverySub}>
                            <span
                                className={
                                    delivered
                                        ? "text-emerald-600"
                                        : o.status === "shipped"
                                        ? "text-purple-600"
                                        : "text-gray-900"
                                }
                            >
                                {delivery}
                            </span>
                        </Meta>
                    </div>
                </div>

                {/* বাটন */}
                <Link
                    to={`${DETAILS_PATH}/${o.id}`}
                    className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1c1c1e] px-4 py-3 text-xs font-semibold text-white transition hover:bg-black lg:w-auto lg:py-2.5"
                >
                    View Order Details <FiArrowRight size={13} />
                </Link>
            </div>
        </article>
    );
};

export default MyOrderCard;