// src/app/ai-ideas/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface IdeaDetailPageProps {
  params: {
    id: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
  description?: string;
  skills?: string[];
  lookingFor?: string[];
  demoVideos?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const ideaTitle = searchParams.get('idea') || 'Untitled Idea';
  const industry = searchParams.get('industry') || '';
  const keywords = searchParams.get('keywords') || '';

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsLoading(false);
        } else {
          // User is not authenticated, redirect to login with return URL
          const currentPath = window.location.pathname + window.location.search;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // On error, redirect to login with return URL
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    };

    checkAuth();
  }, [router]);

  // Auto-generate detailed analysis once user is authenticated
  useEffect(() => {
    if (user && ideaTitle && !detailedAnalysis) {
      generateDetailedAnalysis();
    }
  }, [user, ideaTitle]);

  const generateDetailedAnalysis = async () => {
    setAnalysisLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-ideas/detailed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for JWT
        body: JSON.stringify({ 
          idea: ideaTitle, 
          industry, 
          keywords 
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          router.push('/login');
          return;
        }
        throw new Error('Failed to generate detailed analysis');
      }

      const data = await response.json();
      setDetailedAnalysis(data.analysis);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate detailed analysis');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-8 pb-20 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // This component will only render if user is authenticated
  // (otherwise they'll be redirected to login)
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-8 pb-20 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/ai-ideas"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Ideas Generator
          </Link>
          
          {/* User info */}
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-medium">{user?.username}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {ideaTitle}
              </h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                {industry && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {industry}
                  </span>
                )}
                {keywords && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {keywords}
                  </span>
                )}
              </div>
            </div>

            {/* Analysis Loading State */}
            {analysisLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Generating detailed analysis...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      onClick={generateDetailedAnalysis}
                      className="mt-2 text-sm text-red-800 underline hover:text-red-600"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Analysis Content */}
            {detailedAnalysis && !analysisLoading && (
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="mr-2 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Comprehensive Analysis
                  </h2>
                </div>
                <div className="whitespace-pre-line text-gray-700 leading-relaxed space-y-4">
                  {detailedAnalysis}
                </div>
              </div>
            )}

            {/* Empty State - Manual Generation */}
            {!detailedAnalysis && !analysisLoading && !error && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to analyze your idea</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Get a comprehensive business analysis including market research, implementation strategy, and financial projections.
                </p>
                <button
                  onClick={generateDetailedAnalysis}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Detailed Analysis
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {detailedAnalysis && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${ideaTitle}\n\n${detailedAnalysis}`);
                      // You could add a toast notification here
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Analysis
                  </button>
                  <button
                    onClick={generateDetailedAnalysis}
                    disabled={analysisLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}