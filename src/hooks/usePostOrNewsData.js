import { useState, useEffect, useMemo } from "react";

export const usePostOrNewsData = (
    jsonFilePath = "/newsOrPost.json",
    page = 1,
    limit = 5,
    userId = null // optional: dile shudhu oi userId-r data filter hobe
) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Public folder theke JSON data fetch kora
    useEffect(() => {
        setLoading(true);
        setError(null);
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

    // userId pathale shudhu match kora data rakha, na pathale shob data
    const filteredData = useMemo(() => {
        if (!userId) return data;
        return data.filter((item) => item.userId === userId);
    }, [data, userId]);

    // Passed page & limit onushare data slice ebong total pages calculate kora
    const totalPages = Math.ceil(filteredData.length / limit);
    const validPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
    const startIndex = (validPage - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    return {
        paginatedData,
        totalPages,
        totalDataCount: filteredData.length,
        loading,
        error,
    };
};