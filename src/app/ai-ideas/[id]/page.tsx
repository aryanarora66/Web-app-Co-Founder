'use client';

import { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  LightBulbIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon,
  UserPlusIcon,
  CalculatorIcon,
  UserCircleIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const sectionIcons: Record<string, JSX.Element> = {
  'Business Overview': <LightBulbIcon className="h-5 w-5" />,
  'Target Market': <UserGroupIcon className="h-5 w-5" />,
  'SWOT Analysis': <ShieldCheckIcon className="h-5 w-5" />,
  'Business Model': <CurrencyDollarIcon className="h-5 w-5" />,
  'Competitive Advantage': <SparklesIcon className="h-5 w-5" />,
  'Initial Steps': <ChartBarIcon className="h-5 w-5" />,
  'Potential Challenges': <ShieldCheckIcon className="h-5 w-5" />,
};

export default function DetailedIdeaPage() {
  const searchParams = useSearchParams();
  const [details, setDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const idea = searchParams.get('idea');
  const industry = searchParams.get('industry');
  const keywords = searchParams.get('keywords');

  useEffect(() => {
    if (!idea) return;

    const fetchDetails = async () => {
      try {
        const response = await fetch('/api/ai-ideas/detailed-idea', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idea, industry, keywords }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }

        const data = await response.json();
        setDetails(data.details);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [idea, industry, keywords]);

  if (!idea) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">No idea selected</h1>
          <p className="text-gray-600 mb-6">Please go back and select an idea to view details</p>
          <Link 
            href="/startup-ideas-generator" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to generator
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Fixed Back Button at Top Left */}
        <div className="fixed top-4 left-4 z-10">
          <Link
            href="/ai-ideas"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-blue-600 hover:text-blue-800 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/ai-ideas"
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 group transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span>Back to ideas</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="p-8 sm:p-10">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{idea}</h1>
              
              {industry && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <motion.span 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {industry}
                  </motion.span>
                  {keywords && keywords.split(',').map((kw, i) => (
                    <motion.span 
                      key={i}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {kw.trim()}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <Link
                  href="/team"
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  <UserCircleIcon className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">Create Team</span>
                </Link>

                <Link
                  href="/co-founder"
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-100"
                >
                  <UserPlusIcon className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">Find Co-founder</span>
                </Link>

                <Link
                  href="/funding"
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors border border-purple-100"
                >
                  <CurrencyDollarIcon className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">Get Funding</span>
                </Link>

                <Link
                  href="/finance"
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <CalculatorIcon className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">Calculate Costs</span>
                </Link>
              </div>
            </motion.div>

            {/* Content */}
            {isLoading ? (
              <div className="space-y-8">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="animate-pulse space-y-3"
                  >
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="prose max-w-none">
                {details.split('\n\n').map((section, index) => {
                  const sectionMatch = section.match(/\*\*(.*?)\*\*/);
                  const sectionTitle = sectionMatch ? sectionMatch[1] : '';
                  const sectionContent = section.replace(/\*\*(.*?)\*\*/, '').trim();
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="mb-8 last:mb-0"
                    >
                      {sectionTitle && (
                        <div className="flex items-center mb-3">
                          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                            {sectionIcons[sectionTitle] || <LightBulbIcon className="h-5 w-5" />}
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900">{sectionTitle}</h2>
                        </div>
                      )}
                      <div className="text-gray-700">
                        <ReactMarkdown>
                          {sectionContent}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 px-8 py-6 border-t border-gray-200"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                Generated with AI • {new Date().toLocaleDateString()}
              </p>
              <Link
                href="/ai-ideas"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none transition-colors"
              >
                Generate More Ideas
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}