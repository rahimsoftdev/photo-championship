import { useEffect, useMemo, useSyncExternalStore } from "react";
import { applyStatus, getSnapshot, loadData, subscribe } from "./ordersStore";

const PAGE_SIZE = 8;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// তারিখ ফিল্টারের শুরু ও শেষ সীমা
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
        return [
            from ? new Date(`${from}T00:00:00`) : null,
            to ? new Date(`${to}T23:59:59.999`) : null,
        ];
    }
    return [null, null];
};

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * @param {string} userId           বর্তমান ইউজারের id
 * @param {"buyer"|"seller"} role
 * @param {object} params           { status, date, from, to, sort, page }
 * @returns {{ data, isLoading, error }}
 *   data = { orders, total, totalPages, page, stats, counts }
 */
export function useOrders(userId, role, params = {}) {
    const { status = "all", date = "", from = "", to = "", sort = "desc", page = 1 } = params;

    const snap = useSyncExternalStore(subscribe, getSnapshot);

    useEffect(() => {
        loadData();
    }, []);

    // ইউজারের সব অর্ডার
    const allOrders = useMemo(() => {
        if (!snap.orders || !snap.users || !userId) return [];

        const usersById = Object.fromEntries(snap.users.map((u) => [u.id, u]));
        const ownerKey = role === "buyer" ? "buyerId" : "sellerId";

        return snap.orders
            .filter((o) => o[ownerKey] === userId)
            .map((o) => ({
                ...applyStatus(o, snap.overrides[o.id]),
                buyer: usersById[o.buyerId] ?? null,
                seller: usersById[o.sellerId] ?? null,
            }));
    }, [snap.orders, snap.users, snap.overrides, userId, role]);

    // স্ট্যাটাস ট্যাবের কাউন্ট
    const counts = useMemo(() => {
        const c = { all: allOrders.length, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
        allOrders.forEach((o) => {
            if (c[o.status] !== undefined) c[o.status] += 1;
        });
        return c;
    }, [allOrders]);

    // স্ট্যাটস কার্ড (cancelled অর্ডার বিক্রি/আয়ে ধরা হয় না)
    const stats = useMemo(() => {
        const valid = allOrders.filter((o) => o.status !== "cancelled");
        const totalSales = round2(valid.reduce((s, o) => s + o.pricing.subtotal, 0));
        const commission = round2(
            valid.reduce((s, o) => s + o.pricing.subtotal * o.pricing.commissionRate, 0)
        );
        return {
            totalOrders: allOrders.length,
            totalSales,
            commission,
            earnings: round2(totalSales - commission),
        };
    }, [allOrders]);

    // ফিল্টার + সর্ট
    const filtered = useMemo(() => {
        const [start, end] = getRange(date, from, to);

        return allOrders
            .filter((o) => {
                if (status !== "all" && o.status !== status) return false;
                const placed = new Date(o.placedAt);
                if (start && placed < start) return false;
                if (end && placed > end) return false;
                return true;
            })
            .sort((a, b) =>
                sort === "asc"
                    ? new Date(a.placedAt) - new Date(b.placedAt)
                    : new Date(b.placedAt) - new Date(a.placedAt)
            );
    }, [allOrders, status, date, from, to, sort]);

    // পেজিনেশন
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    const orders = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return {
        data: { orders, total, totalPages, page: currentPage, stats, counts },
        isLoading: snap.status === "idle" || snap.status === "loading",
        error: snap.error,
    };
}