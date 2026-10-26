import { useState, useEffect } from "react";

// jsonFilePath theke data fetch kore, id match kora ekta item return kore
// Use: const { details, loading, error, notFound } = usePostOrNewsDetails("/newsOrPost.json", "msg_099");
export const usePostOrNewsDetails = (jsonFilePath = "/newsOrPost.json", id) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // id na thakle fetch korar dorkar nei
        if (!id) {
            setDetails(null);
            setLoading(false);
            return;
        }

        let ignore = false; // id bodle gele purono response ignore korar jonno
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
                if (ignore) return;
                const found = jsonData.find((item) => item.id === id);
                setDetails(found || null);
                setLoading(false);
            })
            .catch((err) => {
                if (ignore) return;
                setError(err.message);
                setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [jsonFilePath, id]);

    return {
        details,
        loading,
        error,
        notFound: !loading && !error && !details, // fetch sesh, kintu id match hoyni
    };
};