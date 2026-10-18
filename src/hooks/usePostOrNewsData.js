import { useState, useEffect } from "react";

export const usePostOrNewsData = (jsonFilePath = "/newsOrPost.json", page = 1, limit = 5) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Public folder theke JSON data fetch kora
    useEffect(() => {
        setLoading(true);
        fetch(jsonFilePath)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch JSON data");
                }
                return res.json();
            })
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [jsonFilePath]);

    // Passed page & limit onushare data slice ebong total pages calculate kora
    const totalPages = Math.ceil(data.length / limit);
    const validPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
    const startIndex = (validPage - 1) * limit;
    const paginatedData = data.slice(startIndex, startIndex + limit);

    return {
        paginatedData,
        totalPages,
        totalDataCount: data.length,
        loading,
        error,
    };
};