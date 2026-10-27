import { useEffect, useMemo, useSyncExternalStore } from "react";
import { applyStatus, getSnapshot, loadData, subscribe } from "./ordersStore";

/**
 * একটা অর্ডারের ডিটেইল (buyer ও seller ইউজার জোড়া)।
 * @param {string} orderId
 * @returns {{ data, isLoading, error }}  data = অর্ডার অবজেক্ট বা null (না পেলে)
 */
export function useOrder(orderId) {
    const snap = useSyncExternalStore(subscribe, getSnapshot);

    useEffect(() => {
        loadData();
    }, []);

    const data = useMemo(() => {
        if (!snap.orders || !snap.users || !orderId) return null;

        const order = snap.orders.find((o) => o.id === orderId);
        if (!order) return null;

        const usersById = Object.fromEntries(snap.users.map((u) => [u.id, u]));

        return {
            ...applyStatus(order, snap.overrides[order.id]),
            buyer: usersById[order.buyerId] ?? null,
            seller: usersById[order.sellerId] ?? null,
        };
    }, [snap.orders, snap.users, snap.overrides, orderId]);

    return {
        data,
        isLoading: snap.status === "idle" || snap.status === "loading",
        error: snap.error,
    };
}