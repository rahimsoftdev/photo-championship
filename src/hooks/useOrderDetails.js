import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { applyStatus, getSnapshot, loadData, subscribe, updateOrderStatus } from "./ordersStore";

/**
 * একটা অর্ডারের পূর্ণ তথ্য (Order Details / My Order Details)।
 * অর্ডারটা এই ইউজারের না হলে "not found" দেয়, যাতে অন্যের অর্ডার দেখা না যায়।
 *
 * @param {string} orderId  যেমন "ORD-1043"
 * @param {string} userId
 * @param {"buyer"|"seller"} role
 * @returns {{ order, isLoading, error, notFound, updateStatus }}
 */
export function useOrderDetails(orderId, userId, role) {
    const snap = useSyncExternalStore(subscribe, getSnapshot);

    useEffect(() => {
        loadData();
    }, []);

    const order = useMemo(() => {
        if (!snap.orders || !snap.users) return null;

        const found = snap.orders.find((o) => o.id === orderId);
        if (!found) return null;

        // মালিকানা যাচাই
        const ownerId = role === "buyer" ? found.buyerId : found.sellerId;
        if (ownerId !== userId) return null;

        const usersById = Object.fromEntries(snap.users.map((u) => [u.id, u]));

        return {
            ...applyStatus(found, snap.overrides[found.id]),
            buyer: usersById[found.buyerId] ?? null, // seller পেজে Customer Information
            seller: usersById[found.sellerId] ?? null, // buyer পেজে "Sold by"
        };
    }, [snap.orders, snap.users, snap.overrides, orderId, userId, role]);

    // শুধু বিক্রেতা স্ট্যাটাস বদলাতে পারবে
    const updateStatus = useCallback(
        (newStatus) => {
            if (role !== "seller" || !order) return;
            updateOrderStatus(order.id, newStatus);
        },
        [role, order]
    );

    const isLoading = snap.status === "idle" || snap.status === "loading";
    const notFound = !isLoading && !snap.error && !order;

    return {
        order,
        isLoading,
        error: snap.error || (notFound ? "Order not found" : ""),
        notFound,
        updateStatus,
    };
}