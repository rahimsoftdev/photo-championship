import { useState, useEffect } from 'react';

export const useUser = (id) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ID na thakle fetch korar dorkar nei
    if (!id) {
      setLoading(false);
      setUser(null);
      return;
    }

    const fetchUserById = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/users.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users data');
        }

        const data = await response.json();

        // Safe comparison: URL parameter jodi shudhu "122" ba full "user_122" hoy - 2 tai handle korbe
        const foundUser = data.find((u) => {
          const targetId = String(id).toLowerCase();
          const userId = String(u.id).toLowerCase();
          
          return userId === targetId || userId === `user_${targetId}`;
        });

        setUser(foundUser || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [id]);

  return { user, loading, error };
};