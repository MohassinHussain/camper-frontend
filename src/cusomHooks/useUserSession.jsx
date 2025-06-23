"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function useUserSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:5000/logged-in", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        router.replace("/login");
      });
  }, []);

  return { user, loading, error };
}