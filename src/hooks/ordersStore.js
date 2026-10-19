// orders.json ও users.json একবারই লোড হয়, সব hook এই ডাটা শেয়ার করে।

let state = {
    status: "idle", // idle | loading | ready | error
    orders: null,
    users: null,
    error: "",
    overrides: {}, // { [orderId]: newStatus }, লোকাল স্ট্যাটাস পরিবর্তন
};

let loadPromise = null;
const listeners = new Set();

const setState = (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
};

export const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const getSnapshot = () => state;

const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return res.json();
};

export const loadData = () => {
    if (loadPromise) return loadPromise;

    setState({ status: "loading", error: "" });

    loadPromise = Promise.all([fetchJson("/orders.json"), fetchJson("/users.json")])
        .then(([orders, users]) => setState({ orders, users, status: "ready" }))
        .catch((err) => {
            loadPromise = null; // পরে আবার চেষ্টা করা যাবে
            setState({ status: "error", error: err.message || "Something went wrong" });
        });

    return loadPromise;
};

// ডাটা আবার আনতে চাইলে
export const reloadData = () => {
    loadPromise = null;
    setState({ overrides: {} });
    return loadData();
};

// ⚠️ এখন শুধু লোকাল। API এলে এখানে PATCH কল বসান।
export const updateOrderStatus = (orderId, newStatus) => {
    setState({ overrides: { ...state.overrides, [orderId]: newStatus } });
};

/* ---------- স্ট্যাটাস অনুযায়ী অর্ডার ও timeline হালনাগাদ ---------- */

const FLOW = ["placed", "processing", "shipped", "delivered"];
const STATUS_TO_INDEX = { processing: 1, shipped: 2, delivered: 3 };

export const applyStatus = (order, newStatus) => {
    if (!newStatus || newStatus === order.status) return order;

    const old = Object.fromEntries(order.timeline.map((t) => [t.key, t]));
    const now = new Date().toISOString();
    let timeline;

    if (newStatus === "cancelled") {
        timeline = [
            old.placed ?? { key: "placed", label: "Order Placed", note: "Order placed", at: order.placedAt, state: "done" },
            { key: "cancelled", label: "Cancelled", note: "Order cancelled", at: now, state: "cancelled" },
        ];
    } else {
        const current = STATUS_TO_INDEX[newStatus];
        const labels = { placed: "Order Placed", processing: "Processing", shipped: "Shipped", delivered: "Delivered" };

        timeline = FLOW.map((key, i) => {
            const prev = old[key];
            const done = i < current || (i === current && newStatus === "delivered");
            const isCurrent = i === current && newStatus !== "delivered";
            return {
                key,
                label: prev?.label ?? labels[key],
                note: prev?.note ?? "",
                at: done || isCurrent ? (prev?.at ?? now) : null,
                state: done ? "done" : isCurrent ? "current" : "pending",
            };
        });
    }

    return {
        ...order,
        status: newStatus,
        timeline,
        deliveredAt: newStatus === "delivered" ? (order.deliveredAt ?? now) : null,
    };
};