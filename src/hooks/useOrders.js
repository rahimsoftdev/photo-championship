import { useEffect, useMemo, useSyncExternalStore } from "react";
import { applyStatus, getSnapshot, loadData, subscribe } from "./ordersStore";

const emptyStats = (role) =>
    role === "seller"
        ? { totalOrders: 0, totalSales: 0, commission: 0, earnings: 0 }
        : { totalOrders: 0 };

/**
 * তালিকা পেজের ডাটা (Orders / My Orders)।
 * @param {string} userId  যেমন "user_103"
 * @param {"buyer"|"seller"} role
 * @returns {{ orders, stats, counts, isLoading, error }}
 *   orders: প্রতিটায় buyer ও seller ইউজার অবজেক্ট জোড়া থাকে
 *   stats:  কার্ডের হিসাব (role অনুযায়ী আলাদা)
 *   counts: স্ট্যাটাস ট্যাবের কাউন্ট { all, processing, shipped, delivered, cancelled }
 */
export function useOrders(userId, role) {
    const snap = useSyncExternalStore(subscribe, getSnapshot);

    useEffect(() => {
        loadData();
    }, []);

    const orders = useMemo(() => {
        if (!snap.orders || !snap.users || !userId) return [];

        const usersById = Object.fromEntries(snap.users.map((u) => [u.id, u]));
        const ownerKey = role === "buyer" ? "buyerId" : "sellerId";

        return snap.orders
            .filter((o) => o[ownerKey] === userId)
            .map((o) => ({
                ...applyStatus(o, snap.overrides[o.id]),
                buyer: usersById[o.buyerId] ?? null,
                seller: usersById[o.sellerId] ?? null,
            }))
            .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)); // নতুন আগে
    }, [snap.orders, snap.users, snap.overrides, userId, role]);

    const counts = useMemo(() => {
        const c = { all: orders.length, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
        orders.forEach((o) => {
            if (c[o.status] !== undefined) c[o.status] += 1;
        });
        return c;
    }, [orders]);

    const stats = useMemo(() => {
        const base = emptyStats(role);
        base.totalOrders = orders.length;

        if (role === "seller") {
            // cancelled অর্ডার বিক্রি/আয়ে ধরা হয় না
            const valid = orders.filter((o) => o.status !== "cancelled");
            const sum = (fn) => Math.round(valid.reduce((s, o) => s + fn(o), 0) * 100) / 100;

            base.totalSales = sum((o) => o.pricing.subtotal);
            base.commission = sum((o) => o.pricing.subtotal * o.pricing.commissionRate);
            base.earnings = Math.round((base.totalSales - base.commission) * 100) / 100;
        }
        return base;
    }, [orders, role]);

    return {
        orders,
        stats,
        counts,
        isLoading: snap.status === "idle" || snap.status === "loading",
        error: snap.error,
    };
}