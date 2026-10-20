import { useEffect, useMemo, useState } from "react";

const useWinnersArchive = (
  {
    albumType,
    month,
    page,
  } = {},
  itemsPerPage = 12
) => {
  const [allArtworks, setAllArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch artwork data from public/artWork.json.
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
          throw new Error("Failed to fetch artwork data.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Artwork data must be an array.");
        }

        setAllArtworks(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
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

  // Normalize values for case-insensitive comparisons.
  const normalize = (value) =>
    String(value ?? "").trim().toLowerCase();

  // Match album type values used by the sidebar and JSON.
  const albumTypeAliases = {
    "single-photo": ["single-photo", "single"],
    "6-photo-story": ["6-photo-story", "six", "6"],
    "12-photos-full-zodiac-story": [
      "12-photos-full-zodiac-story",
      "twelve",
      "12",
    ],
  };

  // Filter winner artworks using query parameters.
  const filteredArtworks = useMemo(() => {
    return allArtworks.filter((artwork) => {
      // Only include artworks marked as winners.
      if (artwork.isWinner !== true) {
        return false;
      }

      // Filter by album type.
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

      // Filter by month using info.createdAt.
      if (month) {
        const createdAt = artwork.info?.createdAt ?? artwork.createdAt;

        if (!createdAt) {
          return false;
        }

        const artworkDate = new Date(createdAt);

        if (Number.isNaN(artworkDate.getTime())) {
          return false;
        }

        // Query param month uses 1-12.
        const artworkMonth = String(artworkDate.getMonth() + 1);

        if (artworkMonth !== String(month)) {
          return false;
        }
      }

      return true;
    });
  }, [allArtworks, albumType, month]);

  // Calculate pagination after filtering.
  const totalArtworks = filteredArtworks.length;

  const totalPages = Math.ceil(
    totalArtworks / itemsPerPage
  );

  // Keep the current page within valid bounds.
  const currentPage = Math.min(
    Math.max(Number(page) || 1, 1),
    Math.max(totalPages, 1)
  );

  // Return only artworks belonging to the current page.
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

export default useWinnersArchive;
