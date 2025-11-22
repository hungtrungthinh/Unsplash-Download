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

  const handleSearch = async (query: string, orientation: string) => {
    setIsSearching(true);
    setSelectedImages(new Set());
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKey,
          query,
          orientation,
          perPage: 30,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      alert(error instanceof Error ? error.message : 'Search failed');
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
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

