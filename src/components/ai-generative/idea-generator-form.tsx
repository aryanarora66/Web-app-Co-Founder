// components/idea-generator-form.tsx
'use client';

import { useState } from 'react';
import { industries } from '@/data/industries';

interface IdeaGeneratorFormProps {
  onGenerate: (industry: string, keywords: string, mood: string) => void;
  isLoading: boolean;
}

export default function IdeaGeneratorForm({ onGenerate, isLoading }: IdeaGeneratorFormProps) {
  const [industry, setIndustry] = useState('');
  const [keywords, setKeywords] = useState('');
  const [mood, setMood] = useState('innovative');
  const [customIndustry, setCustomIndustry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedIndustry = industry === 'Other' ? customIndustry : industry;
    onGenerate(selectedIndustry, keywords, mood);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
          Industry/Focus Area
        </label>
        <select
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          required
        >
          <option value="">Select an industry</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {industry === 'Other' && (
          <div className="mt-2">
            <input
              type="text"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              placeholder="Enter custom industry"
              required
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
          Keywords/Concepts (comma separated)
        </label>
        <input
          type="text"
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          placeholder="e.g., AI, sustainability, remote work"
        />
      </div>

      <div>
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">
          Mood/Style
        </label>
        <select
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        >
          <option value="innovative">Innovative</option>
          <option value="disruptive">Disruptive</option>
          <option value="practical">Practical</option>
          <option value="fun">Fun</option>
          <option value="social-impact">Social Impact</option>
          <option value="high-tech">High-Tech</option>
          <option value="low-cost">Low-Cost</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || !industry || (industry === 'Other' && !customIndustry)}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Startup Ideas'
        )}
      </button>
    </form>
  );
}