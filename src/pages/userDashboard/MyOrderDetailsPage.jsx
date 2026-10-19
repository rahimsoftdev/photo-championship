import { Link, useNavigate, useParams } from "react-router";
import {
    FiAlertCircle,
    FiArrowLeft,
    FiCheck,
    FiCheckCircle,
    FiCreditCard,
    FiMapPin,
    FiMessageSquare,
    FiPrinter,
    FiShield,
    FiX,
} from "react-icons/fi";
import { useOrderDetails } from "../../hooks/useOrderDetails";

// ⚠️ এখন হার্ডকোড। লগইন সিস্টেম থাকলে সেখান থেকে নিন।
const CURRENT_USER_ID = "user_103";
const LIST_PATH = "/userDashboard/my-orders";

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

const fmtDay = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const fmtStamp = (iso) => `${fmtDay(iso)}, ${fmtTime(iso)}`;

const initials = (name = "") =>
    name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const paymentText = (pm) => (pm.last4 ? `${pm.brand} •••• ${pm.last4}` : pm.brand);

/* ---------- ছোট UI অংশ ---------- */
const Card = ({ children, className = "" }) => (
    <section className={`rounded-xl border border-gray-200 bg-white p-5 ${className}`}>{children}</section>
);

const Title = ({ children }) => (
    <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wide text-gray-500">{children}</h3>
);

const StatusBadge = ({ status }) => {
    const s = STATUS_BADGE[status] ?? STATUS_BADGE.processing;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${s.cls}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
};

const PageSkeleton = () => (
    <div className="mx-auto max-w-3xl animate-pulse space-y-4">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-8 w-1/2 rounded bg-gray-200" />
        {[44, 28, 20, 32].map((h, i) => (
            <div key={i} className="rounded-xl bg-gray-200" style={{ height: `${h * 4}px` }} />
        ))}
    </div>
);

const Step = ({ step, isLast }) => {
    const circle = {
        done: "bg-emerald-500 text-white",
        current: "border-2 border-amber-400 bg-amber-400 text-white",
        cancelled: "bg-red-500 text-white",
        pending: "border-2 border-gray-300 bg-white text-gray-300",
    }[step.state];

    const titleCls =
        step.state === "current"
            ? "text-amber-600"
            : step.state === "pending"
              ? "text-gray-400"
              : "text-gray-900";

    return (
        <li className="flex gap-3">
            <div className="flex flex-col items-center">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${circle}`}>
                    {step.state === "cancelled" ? (
                        <FiX size={11} strokeWidth={3} />
                    ) : step.state === "current" ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    ) : step.state === "done" ? (
                        <FiCheck size={11} strokeWidth={3} />
                    ) : null}
                </span>
                {!isLast && (
                    <span className={`my-1 w-0.5 flex-1 ${step.state === "done" ? "bg-emerald-500" : "bg-gray-200"}`} />
                )}
            </div>

            <div className={`flex flex-1 items-start justify-between gap-3 ${isLast ? "" : "pb-5"}`}>
                <div>
                    <p className={`text-xs font-bold ${titleCls}`}>{step.label}</p>
                    <p className={`mt-0.5 text-[11px] ${step.state === "pending" ? "text-gray-400" : "text-gray-500"}`}>
                        {step.note}
                    </p>
                </div>
                <span className={`shrink-0 text-[10px] ${step.state === "current" ? "text-amber-600" : "text-gray-400"}`}>
                    {step.at ? fmtStamp(step.at) : "Pending"}
                </span>
            </div>
        </li>
    );
};

/* ---------- পেজ ---------- */
const MyOrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { order, isLoading, error, notFound } = useOrderDetails(id, CURRENT_USER_ID, "buyer");

    if (isLoading) return <PageSkeleton />;

    if (notFound || error || !order) {
        return (
            <div className="mx-auto max-w-md py-20 text-center">
                <FiAlertCircle size={36} className="mx-auto text-red-400" />
                <h1 className="mt-3 text-lg font-bold text-gray-900">{error || "Order not found"}</h1>
                <p className="mt-1 text-xs text-gray-500">This order doesn&apos;t exist or isn&apos;t yours.</p>
                <button
                    type="button"
                    onClick={() => navigate(LIST_PATH)}
                    className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                    Back to My Orders
                </button>
            </div>
        );
    }

    const { item, pricing, seller, shippingAddress: addr } = order;
    const storeName = seller?.store?.name ?? seller?.name ?? "Creator Store";
    const verified = seller?.store?.verified;
    const cancelled = order.status === "cancelled";
    const paid = order.paymentStatus === "paid";

    // Estimated Delivery লেখা
    let deliveryText = "—";
    if (order.status === "delivered" && order.deliveredAt) deliveryText = `Delivered on ${fmtLong(order.deliveredAt)}`;
    else if (cancelled) deliveryText = "Order cancelled";
    else if (order.estimatedDelivery) {
        const a = new Date(order.estimatedDelivery.from);
        const b = new Date(order.estimatedDelivery.to);
        const month = (d) => d.toLocaleDateString("en-US", { month: "long" });
        deliveryText =
            month(a) === month(b)
                ? `${month(a)} ${a.getDate()}–${b.getDate()}, ${b.getFullYear()}`
                : `${month(a)} ${a.getDate()} – ${month(b)} ${b.getDate()}, ${b.getFullYear()}`;
    }

    return (
        <div className="mx-auto max-w-3xl space-y-4 pb-12">
            {/* উপরের বার */}
            <div className="flex items-center justify-between">
                <Link
                    to={LIST_PATH}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 transition hover:text-gray-900"
                >
                    <FiArrowLeft size={13} /> Back to My Orders
                </Link>
                <button
                    type="button"
                    onClick={() => window.print()}
                    aria-label="Print order"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                >
                    <FiPrinter size={14} />
                </button>
            </div>

            {/* শিরোনাম */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Order Details <span className="mx-1">›</span>
                        <span className="text-base font-bold normal-case tracking-normal text-gray-900">
                            Order #{order.id}
                        </span>
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                        Placed on {fmtLong(order.placedAt)} at {fmtTime(order.placedAt)}
                    </p>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* Order Progress */}
            <section className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Order Progress</h3>
                    {!cancelled && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                            <FiShield size={12} /> LensArena Buyer Protection Active
                        </span>
                    )}
                </div>
                <ul>
                    {order.timeline.map((step, i) => (
                        <Step key={step.key} step={step} isLast={i === order.timeline.length - 1} />
                    ))}
                </ul>
                {order.trackingNote && !cancelled && (
                    <p className="mt-3 rounded-md bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-700">
                        {order.trackingNote}
                    </p>
                )}
            </section>

            {/* Purchased Product */}
            <Card>
                <Title>Purchased Product</Title>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 object-cover"
                        />
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                            <p className="mt-1 text-[11px] text-gray-500">{item.variant}</p>
                            <p className="mt-0.5 text-[11px] text-gray-500">
                                Sold by: {storeName} <span className="mx-1">•</span> Quantity: {item.quantity}{" "}
                                <span className="mx-1">•</span> Unit Price: {money(item.unitPrice)}
                            </p>
                        </div>
                    </div>
                    <p className="text-base font-bold text-gray-900">{money(pricing.subtotal)}</p>
                </div>
            </Card>

            {/* Sold by */}
            <Card className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                        {initials(storeName)}
                    </span>
                    <div>
                        <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Sold by
                            {verified && (
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] text-emerald-600">
                                    <FiCheckCircle size={9} /> Verified Creator
                                </span>
                            )}
                        </p>
                        <p className="text-sm font-bold text-gray-900">{storeName}</p>
                        <p className="text-[11px] text-gray-500">{seller?.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* ⚠️ এই দুই পাথ আপনার আসল স্টোর/মেসেজ রুট দিয়ে বদলান */}
                    <Link
                        to={`/store/${seller?.id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Visit Store
                    </Link>
                    <Link
                        to={`/userDashboard/messages?to=${seller?.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                        <FiMessageSquare size={12} /> Message
                    </Link>
                </div>
            </Card>

            {/* Payment Summary */}
            <Card>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Payment Summary</h3>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            paid ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        <FiCheck size={10} /> {paid ? "Paid in Full" : "Refunded"}
                    </span>
                </div>

                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Product Subtotal</span>
                        <span className="text-gray-800">{money(pricing.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span className="text-gray-800">{money(pricing.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Discount</span>
                        <span className="text-gray-800">
                            {pricing.discount > 0 ? `−${money(pricing.discount)}` : money(0)}
                        </span>
                    </div>
                </div>

                <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-sm font-bold text-gray-900">
                    <span>{cancelled ? "Total Refunded" : "Total Paid"}</span>
                    <span>{money(pricing.totalPaid)}</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <FiCreditCard size={12} /> Payment Method:{" "}
                        <span className="font-semibold text-gray-800">{paymentText(order.paymentMethod)}</span>
                    </span>
                    <span>{fmtStamp(order.placedAt)}</span>
                </div>
            </Card>

            {/* Shipping Information */}
            <Card>
                <Title>Shipping Information</Title>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-2.5">
                        <FiMapPin size={13} className="mt-0.5 shrink-0 text-gray-400" />
                        <div className="text-xs leading-relaxed text-gray-700">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Shipping Address
                            </p>
                            <p className="mt-1 font-semibold text-gray-900">{addr.name}</p>
                            <p>{addr.line1}</p>
                            <p>
                                {addr.city}, {addr.state} {addr.zip}
                            </p>
                            <p>{addr.country}</p>
                        </div>
                    </div>

                    <div className="text-xs">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            {order.status === "delivered" ? "Delivery" : "Estimated Delivery"}
                        </p>
                        <p className={`mt-1 font-bold ${cancelled ? "text-gray-400" : "text-emerald-600"}`}>
                            {deliveryText}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MyOrderDetailsPage;