import { useEffect, useMemo, useState } from "react";

//distructuring: query params
const useArtwork = ({ title, albumType, category, subcategory } = {},
    competition = true
) => {
    const [allArtworks, setAllArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all artworks from public/artWork.json
    useEffect(() => {
        const controller = new AbortController();

        const fetchArtworks = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/artWork.json", {
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
    }, []);

    // Filter artworks using type and query params
    const artworks = useMemo(() => {
        const selectedType = competition ? "competition" : "gallery";

        // Support the albumType values used by the sidebar and JSON.
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
            // First, filter by competition or gallery.
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

            // Filter by albumType from AlbumSidebar.
            if (albumType?.trim()) {
                const requestedAlbumType = normalize(albumType);
                const aliases = albumTypeAliases[requestedAlbumType];

                const matchesAlbumType = aliases
                    ? aliases.some(
                        (value) => normalize(artwork.albumType) === normalize(value)
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
                normalize(artwork.subcategory) !== normalize(subcategory)
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

    return {
        artworks,
        loading,
        error,
    };
};

export default useArtwork;
