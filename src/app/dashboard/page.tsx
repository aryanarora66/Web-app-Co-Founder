"use client";

import useUser from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        router.push("/login"); // Redirect to login page after logout
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}