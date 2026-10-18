
import { useState } from "react";

const useUserSession = () => {
  const [userSession] = useState(() => {
    try {
      const storedUser = localStorage.getItem("userSession");

      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to read userSession:", error);
      return null;
    }
  });

  return userSession;
};

export default useUserSession;
