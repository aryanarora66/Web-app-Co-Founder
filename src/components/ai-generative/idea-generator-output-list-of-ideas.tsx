'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CopyToClipboard from './copy-to-clipboard';

interface IdeaGeneratorOutputProps {
  ideas: string;
  isLoading: boolean;
  error: string | null;
  industry?: string;
  keywords?: string;
}

export default function IdeaGeneratorOutput({ 
  ideas, 
  isLoading, 
  error, 
  industry = '', 
  keywords = '' 
}: IdeaGeneratorOutputProps) {
  const [parsedIdeas, setParsedIdeas] = useState<Array<{ id: string; title: string; content: string }>>([]);

  useEffect(() => {
    if (ideas) {
      // Parse the ideas into individual cards
      const ideaSections = ideas.split(/\d+\./).filter(section => section.trim());
      const parsed = ideaSections.map((section, index) => {
        const lines = section.split('\n').filter(line => line.trim());
        const title = lines[0]?.trim().replace(/\*\*/g, '') || 'Untitled Idea';
        const content = lines.slice(1).join('\n');
        return { 
          id: `idea-${index}-${Date.now()}`,
          title, 
          content 
        };
      });
      setParsedIdeas(parsed);
    } else {
      setParsedIdeas([]);
    }
  }, [ideas]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-50 rounded-lg">Error: {error}</div>;
  }

  if (!parsedIdeas.length) {
    return (
      <div className="p-6 text-center text-gray-600 bg-blue-50 rounded-lg">
        No ideas generated yet. Enter your criteria and click &ldquo;Generate Ideas&ldquo;!
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Generated Startup Ideas <span className="text-sm text-gray-500">({parsedIdeas.length})</span>
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {parsedIdeas.map((idea) => (
          <div
            key={idea.id}
            className="relative p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
          >
            <CopyToClipboard text={`${idea.title}\n${idea.content}`} />
            <h4 className="font-medium text-blue-600 mb-2 pr-6">{idea.title}</h4>
            <div className="text-sm text-gray-600 whitespace-pre-line mb-4">{idea.content}</div>
            
            <Link
              href={`/ai-ideas/${encodeURIComponent(idea.id)}?idea=${encodeURIComponent(idea.title)}&industry=${encodeURIComponent(industry)}&keywords=${encodeURIComponent(keywords)}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              More Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}