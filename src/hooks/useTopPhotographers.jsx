import { useState, useEffect } from 'react';

export const useTopPhotographers = (typeFilter) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetch('/topPhotoGrapher.json')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch top photographer data');
                }
                return res.json();
            })
            .then((jsonData) => {
                const filtered = typeFilter 
                    ? jsonData.filter((item) => item.albumType === typeFilter) 
                    : jsonData;

                const sorted = [...filtered].sort((a, b) => b.point - a.point);
                const ranked = sorted.map((item, index) => ({
                    ...item,
                    ranking: index + 1,
                }));

                setData(ranked);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [typeFilter]);

    return { isLoading, error, data };
};