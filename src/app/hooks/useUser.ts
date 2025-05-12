import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  instagramUrl?: string;
  imageUrl?: string;
}

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}