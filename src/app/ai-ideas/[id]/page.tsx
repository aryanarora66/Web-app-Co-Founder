// src/app/ai-ideas/[id]/page.tsx)

import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { SparklesIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Assuming some icons
import { motion } from 'framer-motion';

// Add new props to the interface
interface IdeaGeneratorOutputProps {
  ideas: string;
  isLoading: boolean;
  error: string | null;
  industry: string;
  keywords: string;
  isLoggedIn: boolean; // New prop
  generationLimitReached: boolean; // New prop
}

export default function IdeaGeneratorOutput({ 
  ideas, 
  isLoading, 
  error, 
  industry, 
  keywords, 
  isLoggedIn, 
  generationLimitReached 
}: IdeaGeneratorOutputProps) {

  // Function to parse the ideas from the AI response
  const parseIdeas = (rawIdeas: string) => {
    // Assuming ideas are comma-separated or newline-separated
    return rawIdeas
      .split('\n')
      .map(idea => idea.trim())
      .filter(idea => idea.length > 0)
      .slice(0, 5); // Limit to top 5 ideas for display, or adjust as needed
  };

  const parsedIdeas = parseIdeas(ideas);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-md p-4 h-24">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (parsedIdeas.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No ideas generated yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter your criteria to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {parsedIdeas.map((idea, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gray-50 rounded-lg p-5 shadow-sm border border-gray-200"
        >
          <p className="font-semibold text-gray-900 mb-2">
            {idea}
          </p>
          
          {/* Conditional rendering for "Read More" button */}
          {isLoggedIn ? (
            <Link
              href={{
                pathname: '/startup-ideas-generator/detailed-idea', // Adjust path if needed
                query: { idea: idea, industry: industry, keywords: keywords },
              }}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Read More <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <div className="text-sm text-gray-500 mt-2">
              <Link href="/signup" className="text-blue-600 hover:underline font-semibold">Sign up</Link> to view detailed insights.
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}