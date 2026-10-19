import { useState, useEffect, useMemo } from 'react';

export const useProfileArtwork = (dataUrl = '/artworks.json', albumType = 'all', page = 1, itemsPerPage = 8) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(dataUrl);

        // Content-type check for 404 HTML fallback
        const contentType = response.headers.get("content-type");
        if (!response.ok || (contentType && contentType.includes("text/html"))) {
          throw new Error(`Data not found at "${dataUrl}". Make sure file exists in public/ directory.`);
        }

        const data = await response.json();
        setArtworks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [dataUrl]);

  // Album type filtering
  const filteredArtworks = useMemo(() => {
    return artworks.filter((item) => {
      if (!albumType || albumType === 'all') return true;
      return String(item.albumType).toLowerCase() === String(albumType).toLowerCase();
    });
  }, [artworks, albumType]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage) || 1;
  const currentPage = Math.max(Number(page) || 1, 1);
  const safePage = Math.min(currentPage, totalPages);

  const paginatedArtworks = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredArtworks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArtworks, safePage, itemsPerPage]);

  return {
    artworks: paginatedArtworks,
    totalArtworks: filteredArtworks,
    totalPages,
    currentPage: safePage,
    loading,
    error,
  };
};