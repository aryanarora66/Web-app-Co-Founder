"use client";
import React from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import useUser from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-4 sm:px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
              Networty
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <ul className="flex space-x-8">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/founders"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Find Co-founders
                </Link>
              </li>
              <li>
                <Link
                  href="/funding"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Funding
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-ideas"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  AI Ideas
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Profile"
                >
                  <User className="h-6 w-6" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <nav>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/founders"
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Find Co-founders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/funding"
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Funding
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ai-ideas"
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    AI Ideas
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="pt-2 space-y-3 border-t border-gray-200">
              {!loading && user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center justify-center w-full px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-center bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full px-4 py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
