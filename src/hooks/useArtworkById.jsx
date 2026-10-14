import { useEffect, useState } from "react";

const useArtworkById = (id) => {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/artWork.json");

        if (!response.ok) {
          throw new Error("Failed to fetch artwork data");
        }

        const data = await response.json();

        const foundArtwork = data.find(
          (item) => item.id === id
        );

        setArtwork(foundArtwork ?? null);
      } catch (err) {
        setError(err.message);
        setArtwork(null);
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      setArtwork(null);
      setLoading(false);
      return;
    }

    fetchArtwork();
  }, [id]);

  return { artwork, loading, error };
};

export default useArtworkById;
