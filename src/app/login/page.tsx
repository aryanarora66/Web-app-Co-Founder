"use client";

import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <AuthCard
        title="Welcome back"
        subtitle="Login to your account"
        footerText="Don't have an account?"
        footerLinkText="Sign up"
        footerLinkHref="/signup"
      >
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </AuthCard>
    </div>
  );
}