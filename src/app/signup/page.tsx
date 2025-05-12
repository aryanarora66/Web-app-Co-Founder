"use client";

import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <AuthCard
        title="Create your account"
        subtitle="Join our community of Entrepreneurs "
        footerText="Already have an account?"
        footerLinkText="Log in"
        footerLinkHref="/login"
      >
        <SignupForm onSuccess={handleSuccess} />
      </AuthCard>
    </div>
  );
}