import React from "react";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
      </div>

      {children}

      {footerText && footerLinkText && footerLinkHref && (
        <div className="mt-6 text-center text-sm text-gray-600">
          {footerText}{" "}
          <Link href={footerLinkHref} className="font-medium text-blue-600 hover:text-blue-500">
            {footerLinkText}
          </Link>
        </div>
      )}
    </div>
  );
}