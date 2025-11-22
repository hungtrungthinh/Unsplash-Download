'use client';

import { useState } from 'react';

interface SearchProps {
  accessKey: string;
  mode: 'demo' | 'production';
  onSearch: (query: string, orientation: string) => void;
  onReset: () => void;
  isSearching: boolean;
}

const FILTERS = [
  { value: 'all', label: 'All Orientations' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'squarish', label: 'Square' },
];

const POPULAR_KEYWORDS = [
  'technology',
  'nature',
  'city',
  'animals',
  'food',
  'travel',
  'architecture',
  'abstract',
  'business',
  'people',
];

export default function Search({ accessKey, mode, onSearch, onReset, isSearching }: SearchProps) {
  const [query, setQuery] = useState('');
  const [orientation, setOrientation] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), orientation);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    onSearch(keyword, orientation);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Search Photos
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          Change Configuration
        </button>
      </div>

      <div className="mb-4 space-y-2">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Mode:</strong> {mode === 'demo' ? 'Demo API' : 'Production API'} 
            ({mode === 'demo' ? '50' : '5,000'} requests/hour)
          </p>
        </div>
        <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-xs text-green-800 dark:text-green-200 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Configuration saved. Access Key will persist after page refresh.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Keyword
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter keywords to search (e.g., technology, nature, city)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Orientation
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {FILTERS.map((filter) => (
              <label
                key={filter.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  orientation === filter.value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="orientation"
                  value={filter.value}
                  checked={orientation === filter.value}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{filter.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Popular Keywords
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => handleKeywordClick(keyword)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

