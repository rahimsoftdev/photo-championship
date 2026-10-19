import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';

export const useProfileArtwork = (dataUrl = '/artworks.json', userId = null, itemsPerPage = 6) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params theke current state read kora
  const currentAlbumType = searchParams.get('albumType') || 'all';
  const currentPage = Math.max(Number(searchParams.get('page')) || 1, 1);

  // 1. Fetch Data from JSON/API
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch artworks data');
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

  // 2. Filter Artworks by userId and albumType (useMemo for optimization)
  const filteredArtworks = useMemo(() => {
    return artworks.filter((item) => {
      // User ID match check (jodi userId pass kora hoy)
      const matchesUser = userId
        ? String(item.userId).toLowerCase() === String(userId).toLowerCase()
        : true;

      // Album Type filter check (all, single, six, twelve)
      const matchesAlbum =
        currentAlbumType === 'all' ||
        String(item.albumType).toLowerCase() === currentAlbumType.toLowerCase();

      return matchesUser && matchesAlbum;
    });
  }, [artworks, userId, currentAlbumType]);

  // 3. Paginate Filtered Data
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage) || 1;

  // Safe Page adjustment
  const safePage = Math.min(currentPage, totalPages);

  const paginatedArtworks = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredArtworks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArtworks, safePage, itemsPerPage]);

  // 4. Helper function to change album type filter
  const setAlbumType = (type) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (type === 'all') {
        next.delete('albumType');
      } else {
        next.set('albumType', type);
      }
      next.set('page', '1'); // Filter change korle page reset to 1
      return next;
    });
  };

  return {
    artworks: paginatedArtworks,     // Current page er filtered items
    totalArtworks: filteredArtworks, // Shob filtered items
    totalPages,                      // Total page count (Pagination component er jonno)
    currentPage: safePage,
    currentAlbumType,
    setAlbumType,                     // Category/Album type change function
    loading,
    error,
  };
};