import { useEffect, useState } from "react";

/**
 * public/users.json থেকে ইউজার আনে এবং pagination অনুযায়ী পেজের ডাটা দেয়।
 * @param {number} page   URL-এর ?page= থেকে পাওয়া পেজ নম্বর
 * @param {number} limit  প্রতি পেজে কয়টা
 * @returns {{ data: Array, isLoading: boolean, error: string }}
 *   এছাড়া সুবিধার জন্য totalPages ও totalItems-ও দেয়।
 */
export function useUsers(page = 1, limit = 8) {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // users.json একবারই লোড
    useEffect(() => {
        const controller = new AbortController();

        fetch("/users.json", { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load users");
                return res.json();
            })
            .then((json) => setAllUsers(json))
            .catch((err) => {
                if (err.name !== "AbortError") setError(err.message || "Something went wrong");
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, []);

    const totalItems = allUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    // পেজ সীমার বাইরে গেলে ঠিক করে নেয়
    const safePage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
    const start = (safePage - 1) * limit;

    return {
        data: allUsers.slice(start, start + limit),
        isLoading,
        error,
        totalPages,
        totalItems,
    };
}