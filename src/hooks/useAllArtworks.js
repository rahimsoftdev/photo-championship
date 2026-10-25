import { useEffect, useMemo, useState } from "react";

const ALBUM_TYPE_ALIASES = {
    "single-photo": ["single-photo", "single"],
    "6-photo-story": ["6-photo-story", "six", "6"],
    "12-photos-full-zodiac-story": [
        "12-photos-full-zodiac-story",
        "twelve",
        "12",
    ],
};

const normalize = (value) => String(value ?? "").trim().toLowerCase();

// Count korar somoy album type match korar helper
const isAlbumType = (artwork, aliasKey) =>
    ALBUM_TYPE_ALIASES[aliasKey].some(
        (val) => normalize(artwork.albumType) === normalize(val)
    );

/**
 * Custom hook to fetch, filter, sort, and paginate both gallery and competition artworks.
 */
const useAllArtworks = (
    {
        userId, // user er id dile shudhu oi user er artwork ashbe
        title,
        albumType,
        category,
        subcategory,
        type, // 'competition' ba 'gallery' ba khali (shobai er jonno)
        sort = "newest", // 'newest', 'oldest', etc.
        page,
    } = {},
    itemsPerPage = 12,
    url = "/artWork.json"
) => {
    const [allArtworks, setAllArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch artwork data
    useEffect(() => {
        if (!url) return;

        const controller = new AbortController();

        const fetchArtworks = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(url, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch artworks (Status: ${response.status})`);
                }

                const data = await response.json();
                setAllArtworks(Array.isArray(data) ? data : []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Something went wrong");
                    setAllArtworks([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchArtworks();

        return () => controller.abort();
    }, [url]);

    // Filter and Sort Artworks
    const filteredArtworks = useMemo(() => {
        let result = allArtworks.filter((artwork) => {
            // 0. Filter by user id if provided
            if (
                userId !== undefined &&
                userId !== null &&
                String(userId).trim() &&
                normalize(artwork.userId) !== normalize(userId)
            ) {
                return false;
            }

            // 1. Filter by type (competition / gallery) if provided
            if (type?.trim() && normalize(artwork.type) !== normalize(type)) {
                return false;
            }

            // 2. Filter by title search query
            if (
                title?.trim() &&
                !normalize(artwork.title).includes(normalize(title))
            ) {
                return false;
            }

            // 3. Filter by album type
            if (albumType?.trim()) {
                const requestedAlbumType = normalize(albumType);
                const aliases = ALBUM_TYPE_ALIASES[requestedAlbumType];

                const matchesAlbumType = aliases
                    ? aliases.some(
                        (val) => normalize(artwork.albumType) === normalize(val)
                    )
                    : normalize(artwork.albumType) === requestedAlbumType;

                if (!matchesAlbumType) {
                    return false;
                }
            }

            // 4. Filter by category
            if (
                category?.trim() &&
                normalize(artwork.category) !== normalize(category)
            ) {
                return false;
            }

            // 5. Filter by subcategory
            if (
                subcategory?.trim() &&
                normalize(artwork.subCategory) !== normalize(subcategory)
            ) {
                return false;
            }

            return true;
        });

        // Sort Artworks
        if (sort === "newest") {
            result.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
        } else if (sort === "oldest") {
            result.sort((a, b) => new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0));
        }

        return result;
    }, [allArtworks, userId, title, albumType, category, subcategory, type, sort]);

    // Counts (filteredArtworks theke): total, single, six, twelve, competition
    const counts = useMemo(() => {
        return {
            total: filteredArtworks.length,
            single: filteredArtworks.filter((a) => isAlbumType(a, "single-photo")).length,
            six: filteredArtworks.filter((a) => isAlbumType(a, "6-photo-story")).length,
            twelve: filteredArtworks.filter((a) => isAlbumType(a, "12-photos-full-zodiac-story")).length,
            competition: filteredArtworks.filter((a) => normalize(a.type) === "competition").length,
        };
    }, [filteredArtworks]);

    // Pagination Calculations
    const totalArtworks = filteredArtworks.length;
    const totalPages = Math.ceil(totalArtworks / itemsPerPage);

    const currentPage = Math.min(
        Math.max(Number(page) || 1, 1),
        Math.max(totalPages, 1)
    );

    const artworks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredArtworks.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredArtworks, currentPage, itemsPerPage]);

    return {
        artworks,
        filteredArtworks,
        totalArtworks,
        counts,
        totalPages,
        currentPage,
        itemsPerPage,
        loading,
        error,
    };
};

export default useAllArtworks;