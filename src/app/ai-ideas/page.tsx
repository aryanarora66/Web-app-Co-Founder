// src/app/ai-ideas/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import IdeaGeneratorForm from '@/components/ai-generative/idea-generator-form';
import IdeaGeneratorOutput from '@/components/ai-generative/idea-generator-output-list-of-ideas';
import { useUnsignedUserTracker } from '@/hooks/useUnsignedUserTracker';
import Link from 'next/link';

const MAX_UNSIGNED_GENERATIONS = 1;

export default function StartupIdeasGenerator() {
  const router = useRouter();
  const { userId, count, increment, reset } = useUnsignedUserTracker();
  const [ideas, setIdeas] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndustry, setCurrentIndustry] = useState('');
  const [currentKeywords, setCurrentKeywords] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canGenerate, setCanGenerate] = useState(false);

  const generationLimitReached = !isLoggedIn && count >= MAX_UNSIGNED_GENERATIONS;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok) {
          setIsLoggedIn(true);
          setCanGenerate(true);
        } else {
          setIsLoggedIn(false);
          setCanGenerate(count < MAX_UNSIGNED_GENERATIONS);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setIsLoggedIn(false);
        setCanGenerate(count < MAX_UNSIGNED_GENERATIONS);
      }
    };
    fetchUser();
  }, [count]);

  const handleGenerate = async (industry: string, keywords: string, mood: string) => {
    if (generationLimitReached && !isLoggedIn) {
        setError(`You've reached your generation limit of ${MAX_UNSIGNED_GENERATIONS} as an unsigned user. Please sign in to generate more ideas.`);
        return;
    }

    setIsLoading(true);
    setError(null);
    setIdeas('');
    setCurrentIndustry(industry);
    setCurrentKeywords(keywords);

    try {
      const response = await fetch('/api/ai-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry, keywords, mood }),
      });

      if (!response.ok) {
        throw new Error(response.status === 429 
          ? 'Too many requests. Please wait a moment and try again.' 
          : 'Failed to generate ideas');
      }

      const data = await response.json();
      setIdeas(data.ideas);
      
      if (!isLoggedIn) {
        increment();
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate ideas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleFindCofounder = () => {
    router.push('/founders');
  };

  const formDisabled = isLoading || !canGenerate;

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-8 pb-20"
      style={{ paddingTop: '100px' }}
    >
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI Startup Idea Generator
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Get inspired with unique, tailored startup ideas powered by our AI
          </p>
          {!isLoggedIn && (
            <p className="mt-2 text-sm text-gray-500">
              You have generated {count} of {MAX_UNSIGNED_GENERATIONS} free ideas. 
              {generationLimitReached && (
                <> Please <Link href="/signup" className="text-blue-600 hover:underline font-semibold">sign up</Link> to generate more.</>
              )}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-1">
                <div className="sticky top-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Idea Criteria
                  </h2>
                  <div className="text-gray-800">
                    <IdeaGeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
                  </div>
                  {generationLimitReached && !isLoggedIn && (
                    <p className="mt-4 text-sm text-red-600">
                        You&apos;ve reached your limit. <Link href="/signup" className="font-semibold underline">Sign up</Link> for unlimited generations!
                    </p>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Generated Ideas
                </h2>
                <div className="text-gray-800">
                  <IdeaGeneratorOutput 
                    ideas={ideas} 
                    isLoading={isLoading} 
                    error={error}
                    industry={currentIndustry}
                    keywords={currentKeywords}
                    isLoggedIn={isLoggedIn}
                    generationLimitReached={generationLimitReached}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500 mb-4">
            <p>
              {!isLoggedIn && count < MAX_UNSIGNED_GENERATIONS && `No login required for your first ${MAX_UNSIGNED_GENERATIONS} idea generation${MAX_UNSIGNED_GENERATIONS > 1 ? 's' : ''}. `}
              Ideas are generated on-demand using AI.
            </p>
          </div>
          
          <button
            onClick={handleFindCofounder}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Find Co-founder
          </button>
        </div>
      </div>
    </div>
  );
}