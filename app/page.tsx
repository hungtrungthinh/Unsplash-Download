'use client';

import { useState } from 'react';
import Configuration from '@/components/Configuration';
import Search from '@/components/Search';
import Results from '@/components/Results';

interface ImageResult {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    thumb: string;
  };
  description?: string;
  alt_description?: string;
  width: number;
  height: number;
}

export default function Home() {
  const [accessKey, setAccessKey] = useState('');
  const [mode, setMode] = useState<'demo' | 'production'>('demo');
  const [isConfigured, setIsConfigured] = useState(false);
  const [searchResults, setSearchResults] = useState<ImageResult[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);

  const handleConfigure = (key: string, selectedMode: 'demo' | 'production') => {
    setAccessKey(key);
    setMode(selectedMode);
    setIsConfigured(true);
  };

  const handleReset = () => {
    setAccessKey('');
    setMode('demo');
    setIsConfigured(false);
    setSearchResults([]);
    setSelectedImages(new Set());
  };

  const [error, setError] = useState('');

  const handleSearch = async (query: string, orientation: string) => {
    setIsSearching(true);
    setSelectedImages(new Set());
    setError('');
    
    try {
      if (!accessKey || accessKey.trim() === '' || accessKey === 'YOUR_ACCESS_KEY') {
        throw new Error('Please configure a valid Access Key first');
      }

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKey: accessKey.trim(),
          query,
          orientation,
          perPage: 30,
        }),
      });

      // Read response body only once
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response format: ${text}`);
      }
      
      if (!response.ok) {
        const errorMessage = data.error || 'Search failed';
        const errorDetails = data.details ? `\n\nDetails: ${data.details}` : '';
        throw new Error(`${errorMessage}${errorDetails}`);
      }
      setSearchResults(data.results || []);
      
      if (data.results && data.results.length === 0) {
        setError('No results found. Try different keywords.');
      }
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageSelect = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedImages.size === searchResults.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(searchResults.map(img => img.id)));
    }
  };

  const handleDownload = async () => {
    if (selectedImages.size === 0) {
      alert('Please select at least one image');
      return;
    }

    const imagesToDownload = searchResults.filter(img => selectedImages.has(img.id));
    
    try {
      const response = await fetch('/api/download-selected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: imagesToDownload }),
      });

      // For download, check status and read blob
      if (!response.ok) {
        // Clone response to read error without consuming body
        const clonedResponse = response.clone();
        let errorMessage = 'Download failed';
        try {
          const contentType = clonedResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await clonedResponse.json();
            errorMessage = errorData.error || 'Download failed';
          } else {
            const errorText = await clonedResponse.text();
            errorMessage = errorText || 'Download failed';
          }
        } catch (e) {
          errorMessage = `Download failed: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unsplash-photos-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert(error instanceof Error ? error.message : 'Download failed');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Unsplash Photo Downloader
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Search and download high-resolution photos from Unsplash
            </p>
          </div>

          {!isConfigured ? (
            <Configuration onConfigure={handleConfigure} />
          ) : (
            <div className="space-y-6">
              <Search 
                accessKey={accessKey}
                mode={mode}
                onSearch={handleSearch}
                onReset={handleReset}
                isSearching={isSearching}
              />
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                        Error
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line">{error}</p>
                      {error.includes('Access Key') && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                          Make sure you've copied the complete Access Key from{' '}
                          <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" className="underline">
                            Unsplash Developers
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {searchResults.length > 0 && (
                <Results
                  images={searchResults}
                  selectedImages={selectedImages}
                  onImageSelect={handleImageSelect}
                  onSelectAll={handleSelectAll}
                  onDownload={handleDownload}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

