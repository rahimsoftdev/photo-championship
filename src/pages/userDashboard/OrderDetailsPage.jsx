import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    FiAlertCircle,
    FiBox,
    FiCheck,
    FiChevronDown,
    FiCopy,
    FiCreditCard,
    FiLoader,
    FiMail,
    FiMapPin,
    FiPhone,
    FiTruck,
    FiUser,
    FiX,
} from "react-icons/fi";
import { useOrder } from "../../hooks/useOrder";
import { updateOrderStatus } from "../../hooks/ordersStore";

const LIST_PATH = "/user-dashboard/orders";

const STATUS_OPTIONS = [
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

const STATUS_BADGE = {
    processing: { label: "Processing", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
    shipped: { label: "Shipped", cls: "bg-purple-50 text-purple-700", dot: "bg-purple-500" },
    delivered: { label: "Delivered", cls: "bg-green-50 text-green-700", dot: "bg-green-500" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600", dot: "bg-red-500" },
};

// ড্রপডাউনে আগে থেকে পরের ধাপ বাছা থাকবে
const NEXT_STATUS = { processing: "shipped", shipped: "delivered" };

const STEPS = [
    { key: "placed", label: "Order Placed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
];

/* ---------- হেল্পার ---------- */
const money = (n) =>
    `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const fmtFull = (iso) =>
    `${new Date(iso).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })} · ${fmtTime(iso)}`;

const initials = (name = "") =>
    name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

// স্ট্যাটাস থেকে টাইমলাইন বানায় (স্ট্যাটাস বদলালে সাথে সাথে ঠিক থাকে)
const buildTimeline = (order) => {
    const saved = Object.fromEntries((order.timeline ?? []).map((t) => [t.key, t]));
    const currentIndex = STEPS.findIndex((s) => s.key === order.status);
    const cancelled = order.status === "cancelled";

    const steps = STEPS.map((s, i) => {
        let state = "pending";
        if (cancelled) state = i === 0 ? "done" : "pending";
        else if (order.status === "delivered") state = "done";
        else if (i <= currentIndex) state = "done";

        return { ...s, state, at: state === "done" ? saved[s.key]?.at ?? null : null };
    });

    if (cancelled) steps.push({ key: "cancelled", label: "Cancelled", state: "cancelled", at: null });
    return steps;
};

/* ---------- ছোট UI অংশ ---------- */
const Card = ({ children, className = "" }) => (
    <section className={`rounded-xl border border-gray-200 bg-white p-4 ${className}`}>{children}</section>
);

const SectionTitle = ({ icon: Icon, children, className = "text-gray-500" }) => (
    <h3 className={`mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide ${className}`}>
        {Icon && <Icon size={12} />}
        {children}
    </h3>
);

const InfoRow = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-2.5">
        <Icon size={13} className="mt-0.5 shrink-0 text-gray-400" />
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-0.5 break-words text-xs text-gray-800">{children}</p>
        </div>
    </div>
);

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

const PageSkeleton = () => (
    <div className="mx-auto w-full max-w-3xl animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="h-16 rounded-xl bg-gray-200" />
            <div className="h-16 rounded-xl bg-gray-200" />
        </div>
        {[160, 112, 144, 160].map((h, i) => (
            <div key={i} className="rounded-xl bg-gray-200" style={{ height: h }} />
        ))}
    </div>
);

const TimelineStep = ({ step, isLast, extraNote }) => {
    const styles = {
        done: "bg-emerald-500 text-white",
        cancelled: "bg-red-500 text-white",
        pending: "border-2 border-gray-300 bg-white text-transparent",
    };

    return (
        <li className="flex gap-3">
            <div className="flex flex-col items-center">
                <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        styles[step.state] ?? styles.pending
                    }`}
                >
                    {step.state === "cancelled" ? (
                        <FiX size={13} strokeWidth={3} />
                    ) : step.state === "done" ? (
                        <FiCheck size={13} strokeWidth={3} />
                    ) : null}
                </span>
                {!isLast && (
                    <span className={`my-1 w-0.5 flex-1 ${step.state === "done" ? "bg-emerald-500" : "bg-gray-200"}`} />
                )}
            </div>

            <div className={`flex min-w-0 flex-1 items-start justify-between gap-3 ${isLast ? "" : "pb-5"}`}>
                <div className="min-w-0">
                    <p
                        className={`text-xs font-bold ${
                            step.state === "pending" ? "text-gray-400" : "text-gray-900"
                        }`}
                    >
                        {step.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                        {step.at ? fmtDate(step.at) : step.state === "pending" ? "Pending" : ""}
                    </p>
                    {extraNote && (
                        <span className="mt-1.5 inline-block rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                            {extraNote}
                        </span>
                    )}
                </div>
                {step.at && <span className="shrink-0 text-[10px] text-gray-400">{fmtTime(step.at)}</span>}
            </div>
        </li>
    );
};

/* ---------- পেজ ---------- */
const OrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: order, isLoading, error } = useOrder(id);

    const [selected, setSelected] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState("");

    // অর্ডার/স্ট্যাটাস বদলালে ড্রপডাউনে পরের ধাপ আগে থেকে বাছা থাকবে
    useEffect(() => {
        if (order) setSelected(NEXT_STATUS[order.status] ?? order.status);
    }, [order?.status, order?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // টোস্ট ৩ সেকেন্ড পর মুছবে
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(""), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const copyId = async () => {
        try {
            await navigator.clipboard.writeText(order.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* ক্লিপবোর্ড বন্ধ থাকলে কিছু করার নেই */
        }
    };

    const handleUpdate = async () => {
        if (!selected || selected === order.status || isUpdating) return;
        setIsUpdating(true);
        // আসল API এলে এখানে await করুন
        await new Promise((r) => setTimeout(r, 600));
        updateOrderStatus(order.id, selected);
        setIsUpdating(false);
        setToast(`Order status updated to ${STATUS_OPTIONS.find((o) => o.value === selected)?.label}.`);
    };

    /* ---------- লোডিং / এরর ---------- */
    if (isLoading) return <PageSkeleton />;

    if (error || !order) {
        return (
            <div className="mx-auto max-w-md px-4 py-20 text-center">
                <FiAlertCircle size={36} className="mx-auto text-red-400" />
                <h1 className="mt-3 text-lg font-bold text-gray-900">{error ? String(error) : "Order not found"}</h1>
                <p className="mt-1 text-xs text-gray-500">This order doesn&apos;t exist.</p>
                <button
                    type="button"
                    onClick={() => navigate(LIST_PATH)}
                    className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    /* ---------- হিসাব ---------- */
    const { pricing, item, buyer, shippingAddress: addr } = order;
    const isCancelled = order.status === "cancelled";
    const isFinal = order.status === "delivered" || isCancelled;
    const customerName = buyer?.name ?? addr?.name ?? "Unknown";
    const email = buyer?.email;
    const phone = buyer?.phone ?? addr?.phone;
    const paymentOk = order.paymentStatus === "paid";
    const commission = isCancelled ? 0 : pricing.commission ?? pricing.subtotal * pricing.commissionRate;
    const earnings = isCancelled ? 0 : pricing.sellerEarnings ?? pricing.subtotal - commission;

    const address = [
        addr?.line1,
        addr?.line2,
        [addr?.city, [addr?.state, addr?.zip].filter(Boolean).join(" ")].filter(Boolean).join(", "),
        addr?.country,
    ]
        .filter(Boolean)
        .join(", ");

    const actionLabel =
        selected === "delivered"
            ? "Mark as Delivered"
            : selected === "shipped"
              ? "Mark as Shipped"
              : selected === "cancelled"
                ? "Cancel Order"
                : "Update Status";
    const ActionIcon = selected === "delivered" || selected === "shipped" ? FiTruck : FiCheck;

    const steps = buildTimeline(order);
    const firstPendingKey = steps.find((s) => s.state === "pending")?.key;

    return (
        <div className="mx-auto w-full pb-12">
            {/* সফল বার্তা */}
            {toast && (
                <div
                    role="status"
                    className="fixed right-4 top-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700 shadow-lg"
                >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <FiCheck size={12} strokeWidth={3} />
                    </span>
                    {toast}
                </div>
            )}

            <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 sm:space-y-4 sm:p-6">
                {/* হেডার */}
                <div className="flex items-start justify-between gap-3 border-b border-gray-200 pb-4">
                    <div className="min-w-0">
                        <h1 className="flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                            <span className="break-all">Order #{order.id}</span>
                            <button
                                type="button"
                                onClick={copyId}
                                aria-label="Copy order ID"
                                className="shrink-0 text-gray-400 transition hover:text-gray-700"
                            >
                                {copied ? <FiCheck size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
                            </button>
                        </h1>
                        <p className="mt-0.5 text-[11px] text-gray-500">{fmtFull(order.placedAt)}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <StatusBadge status={order.status} />
                        <button
                            type="button"
                            onClick={() => navigate(LIST_PATH)}
                            aria-label="Close"
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                        >
                            <FiX size={14} />
                        </button>
                    </div>
                </div>

                {/* Payment ও Fulfillment */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Card>
                        <SectionTitle icon={FiCreditCard}>Payment</SectionTitle>
                        <p
                            className={`flex items-center gap-1.5 text-sm font-bold ${
                                paymentOk ? "text-emerald-600" : "text-red-500"
                            }`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${paymentOk ? "bg-emerald-500" : "bg-red-500"}`} />
                            {paymentOk ? "Paid" : order.paymentStatus === "refunded" ? "Refunded" : "Unpaid"}
                        </p>
                        {order.paymentMethod?.type === "card" && (
                            <p className="mt-1 text-[10px] text-gray-400">
                                {order.paymentMethod.brand} •••• {order.paymentMethod.last4}
                            </p>
                        )}
                    </Card>
                    <Card>
                        <SectionTitle icon={FiTruck}>Fulfillment</SectionTitle>
                        <p className="text-sm font-bold capitalize text-gray-900">{order.status}</p>
                    </Card>
                </div>

                {/* Customer Information */}
                <Card>
                    <SectionTitle icon={FiUser}>Customer Information</SectionTitle>
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
                            {initials(customerName)}
                        </span>
                        <p className="min-w-0 truncate text-sm font-bold text-gray-900">{customerName}</p>
                    </div>

                    <div className="space-y-3">
                        {email && (
                            <InfoRow icon={FiMail} label="Email">
                                {email}
                            </InfoRow>
                        )}
                        {phone && (
                            <InfoRow icon={FiPhone} label="Phone">
                                {phone}
                            </InfoRow>
                        )}
                        {address && (
                            <InfoRow icon={FiMapPin} label="Shipping Address">
                                {address}
                            </InfoRow>
                        )}
                    </div>
                </Card>

                {/* Product Information */}
                <Card>
                    <SectionTitle icon={FiBox}>Product Information</SectionTitle>
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-12 w-12 shrink-0 rounded-md bg-gray-100 object-cover"
                            />
                            <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-gray-900">{item.title}</p>
                                {item.variant && (
                                    <p className="mt-0.5 truncate text-[10px] text-gray-400">{item.variant}</p>
                                )}
                                <p className="mt-0.5 text-[10px] text-gray-500">
                                    {money(item.unitPrice)} × {item.quantity}
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">Subtotal</p>
                            <p className="text-sm font-bold text-gray-900">{money(pricing.subtotal)}</p>
                        </div>
                    </div>
                </Card>

                {/* Payment Breakdown */}
                <section className="rounded-xl border border-emerald-300 bg-white p-4">
                    <SectionTitle icon={FiCreditCard} className="text-emerald-600">
                        Payment Breakdown
                    </SectionTitle>

                    <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Order Total</span>
                            <span className={`font-bold ${isCancelled ? "text-gray-400 line-through" : "text-gray-900"}`}>
                                {money(pricing.subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">
                                Platform Commission ({Math.round(pricing.commissionRate * 100)}%)
                            </span>
                            <span className="text-gray-400">{isCancelled ? "—" : `−${money(commission)}`}</span>
                        </div>
                    </div>

                    <div
                        className={`mt-3 flex items-center justify-between rounded-lg px-4 py-3 text-white ${
                            isCancelled ? "bg-gray-400" : "bg-emerald-500"
                        }`}
                    >
                        <span className="text-xs font-bold">Seller Earnings</span>
                        <span className="text-xl font-bold">{money(earnings)}</span>
                    </div>

                    <p className="mt-3 text-center text-[10px] text-gray-400">
                        {isCancelled
                            ? "This order was cancelled. No earnings were added."
                            : "Earnings are added to your balance after delivery confirmation."}
                    </p>
                </section>

                {/* Seller Actions */}
                <section className="rounded-xl bg-[#1c1c1e] p-4 text-white">
                    <h3 className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Seller Actions</h3>

                    <label htmlFor="status-select" className="mt-3 block text-[11px] font-semibold text-gray-200">
                        Update Status:
                    </label>
                    <div className="relative mt-1.5">
                        <select
                            id="status-select"
                            value={selected}
                            disabled={isFinal || isUpdating}
                            onChange={(e) => setSelected(e.target.value)}
                            className="w-full appearance-none rounded-lg border border-white/10 bg-[#2a2a2d] px-3 py-3 pr-9 text-xs font-medium text-white outline-none transition focus:border-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={isFinal || isUpdating || selected === order.status}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 py-3 text-xs font-bold text-gray-900 transition hover:bg-amber-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-amber-400"
                    >
                        {isUpdating ? <FiLoader size={14} className="animate-spin" /> : <ActionIcon size={14} />}
                        {isUpdating ? "Updating..." : actionLabel}
                    </button>

                    {isFinal && (
                        <p className="mt-2 text-center text-[10px] text-gray-400">
                            This order is {order.status}, so its status can no longer be changed.
                        </p>
                    )}
                </section>

                {/* Order Timeline */}
                <Card>
                    <SectionTitle>Order Timeline</SectionTitle>
                    <ul>
                        {steps.map((step, i) => (
                            <TimelineStep
                                key={step.key}
                                step={step}
                                isLast={i === steps.length - 1}
                                extraNote={step.key === firstPendingKey ? order.trackingNote : null}
                            />
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default OrderDetailsPage;