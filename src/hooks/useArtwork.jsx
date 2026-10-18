import { useEffect, useMemo, useState } from "react";

// Extract query params using destructuring.
const useArtwork = (
    {
        title,
        albumType,
        category,
        subcategory,
        page,
    } = {},
    competition = true,
    itemsPerPage = 9,
    url

) => {
    const [allArtworks, setAllArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all artworks from public/artWork.json.
    useEffect(() => {
        const controller = new AbortController();

        const fetchArtworks = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(  url, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch artworks");
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

    // Filter artworks by type, title, album type, category, and subcategory.
    const filteredArtworks = useMemo(() => {
        const selectedType = competition ? "competition" : "gallery";

        const albumTypeAliases = {
            "single-photo": ["single-photo", "single"],
            "6-photo-story": ["6-photo-story", "six", "6"],
            "12-photos-full-zodiac-story": [
                "12-photos-full-zodiac-story",
                "twelve",
                "12",
            ],
        };

        const normalize = (value) =>
            String(value ?? "").trim().toLowerCase();

        return allArtworks.filter((artwork) => {
            // Filter competition or gallery artworks.
            if (normalize(artwork.type) !== selectedType) {
                return false;
            }

            // Filter by title from SearchBar.
            if (
                title?.trim() &&
                !normalize(artwork.title).includes(normalize(title))
            ) {
                return false;
            }

            // Filter by album type from AlbumSidebar.
            if (albumType?.trim()) {
                const requestedAlbumType = normalize(albumType);
                const aliases = albumTypeAliases[requestedAlbumType];

                const matchesAlbumType = aliases
                    ? aliases.some(
                        (value) =>
                            normalize(artwork.albumType) === normalize(value)
                    )
                    : normalize(artwork.albumType) === requestedAlbumType;

                if (!matchesAlbumType) {
                    return false;
                }
            }

            // Filter by category.
            if (
                category?.trim() &&
                normalize(artwork.category) !== normalize(category)
            ) {
                return false;
            }

            // Filter by subcategory.
            if (
                subcategory?.trim() &&
                normalize(artwork.subCategory) !== normalize(subcategory)
            ) {
                return false;
            }

            return true;
        });
    }, [
        allArtworks,
        title,
        albumType,
        category,
        subcategory,
        competition,
    ]);

    // Calculate total pages after applying all filters.
    const totalArtworks = filteredArtworks.length;
    const totalPages = Math.ceil(totalArtworks / itemsPerPage);

    // Ensure the current page stays within valid bounds.
    const currentPage = Math.min(
        Math.max(Number(page) || 1, 1),
        Math.max(totalPages, 1)
    );

    // Return only artworks for the current page.
    const artworks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;

        return filteredArtworks.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [filteredArtworks, currentPage, itemsPerPage]);

    return {
        artworks,
        filteredArtworks,
        totalArtworks,
        totalPages,
        currentPage,
        itemsPerPage,
        loading,
        error,
    };
};

export default useArtwork;
