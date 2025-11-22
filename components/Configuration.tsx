'use client';

import { useState } from 'react';

interface ConfigurationProps {
  onConfigure: (accessKey: string, mode: 'demo' | 'production') => void;
  savedAccessKey?: string;
  savedMode?: 'demo' | 'production';
}

export default function Configuration({ onConfigure, savedAccessKey, savedMode }: ConfigurationProps) {
  const [accessKey, setAccessKey] = useState(savedAccessKey || '');
  const [mode, setMode] = useState<'demo' | 'production'>(savedMode || 'demo');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationError('');
    
    if (!accessKey.trim()) {
      setError('Please enter your Unsplash Access Key');
      return;
    }

    if (accessKey === 'YOUR_ACCESS_KEY') {
      setError('Please replace YOUR_ACCESS_KEY with your actual Access Key');
      return;
    }

    // Validate Access Key before saving
    setIsValidating(true);
    setValidationError('');

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKey: accessKey.trim(),
        }),
      });

      const data = await response.json();

      if (!data.valid) {
        setValidationError(data.error || 'Invalid Access Key');
        setIsValidating(false);
        return;
      }

      // Access Key is valid, proceed with configuration
      setError('');
      setValidationError('');
      setIsValidating(false);
      onConfigure(accessKey.trim(), mode);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationError('Failed to validate Access Key. Please check your internet connection and try again.');
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="accessKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unsplash Access Key
          </label>
          <input
            type="text"
            id="accessKey"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder="Enter your Unsplash API Access Key"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Get your Access Key from{' '}
            <a 
              href="https://unsplash.com/developers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Unsplash Developers
            </a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Mode
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="mode"
                value="demo"
                checked={mode === 'demo'}
                onChange={() => setMode('demo')}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Demo API</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  50 requests per hour - For testing and development
                </div>
              </div>
            </label>
            <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="mode"
                value="production"
                checked={mode === 'production'}
                onChange={() => setMode('production')}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Production API</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  5,000 requests per hour - Requires approval from Unsplash
                </div>
              </div>
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {validationError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Access Key Validation Failed
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Make sure you've copied the complete Access Key from{' '}
                  <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" className="underline">
                    Unsplash Developers
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {isValidating && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400 mr-2"></div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Validating Access Key...
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isValidating}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {isValidating ? 'Validating...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}

