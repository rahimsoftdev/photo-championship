import { useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiBell, FiHome } from "react-icons/fi";

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

/* ---------- অ্যাভাটার: system হলে আইকন, user হলে ছবি (ফেইল করলে নামের প্রথম অক্ষর) ---------- */
const Avatar = ({ item }) => {
    const [failed, setFailed] = useState(false);

    if (item.type === "system") {
        return (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#008489] text-white">
                <FiHome size={18} />
            </span>
        );
    }

    if (!item.avatar || failed) {
        return (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8EAFB] text-sm font-bold text-[#4048CD]">
                {(item.senderName ?? "?").charAt(0).toUpperCase()}
            </span>
        );
    }

    return (
        <img
            src={item.avatar}
            alt={item.senderName ?? "User"}
            onError={() => setFailed(true)}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
    );
};

/* ---------- লোডিং স্কেলেটন ---------- */
const SkeletonRow = () => (
    <div className="flex animate-pulse items-start gap-3 border-b border-gray-200 py-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-gray-200" />
            <div className="h-3 w-1/4 rounded bg-gray-200" />
        </div>
    </div>
);

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // public/notifications.json লোড
    useEffect(() => {
        const controller = new AbortController();

        fetch("/notifications.json", { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load notifications");
                return res.json();
            })
            .then((data) => {
                // নতুন আগে
                const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
                setNotifications(sorted);
            })
            .catch((err) => {
                if (err.name !== "AbortError") setError(err.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, []);

    const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

    const markAsRead = (id) =>
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

    const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    return (
        <div className="w-full pb-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllAsRead}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Mark all as read ({unreadCount})
                    </button>
                )}
            </div>

            <div className="mt-4">
                {/* লোডিং */}
                {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                {/* এরর */}
                {!isLoading && error && (
                    <div
                        role="alert"
                        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600"
                    >
                        <FiAlertCircle size={15} className="shrink-0" />
                        {error}
                    </div>
                )}

                {/* খালি */}
                {!isLoading && !error && notifications.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
                        <FiBell size={32} />
                        <p className="text-sm">You have no notifications yet.</p>
                    </div>
                )}

                {/* তালিকা */}
                {!isLoading && !error && notifications.length > 0 && (
                    <ul>
                        {notifications.map((item) => (
                            <li key={item.id} className="border-b border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => !item.isRead && markAsRead(item.id)}
                                    className="flex w-full items-start gap-3 py-4 text-left transition hover:bg-gray-50/70"
                                >
                                    <Avatar item={item} />

                                    <span className="block max-w-sm">
                                        <span
                                            className={`block text-xs leading-snug ${
                                                item.isRead ? "text-gray-500" : "font-bold text-gray-900"
                                            }`}
                                        >
                                            {item.message}
                                        </span>
                                        <span className="mt-1 block text-[11px] text-gray-500">
                                            {formatDate(item.date)}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;