'use client';

import { useState, useRef, useEffect } from 'react';
import Configuration from '@/components/Configuration';
import Search from '@/components/Search';
import Results from '@/components/Results';
import ProgressBar from '@/components/ProgressBar';
import Footer from '@/components/Footer';
import JSZip from 'jszip';

const STORAGE_KEY = 'unsplash_config';

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
  const [isLoading, setIsLoading] = useState(true);

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (config.accessKey && config.mode) {
          setAccessKey(config.accessKey);
          setMode(config.mode);
          setIsConfigured(true);
        }
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfigure = (key: string, selectedMode: 'demo' | 'production') => {
    setAccessKey(key);
    setMode(selectedMode);
    setIsConfigured(true);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accessKey: key,
        mode: selectedMode,
      }));
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const handleReset = () => {
    setAccessKey('');
    setMode('demo');
    setIsConfigured(false);
    setSearchResults([]);
    setSelectedImages(new Set());
    
    // Clear from localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing configuration:', error);
    }
  };

  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    progress: 0,
    speed: '0 B/s',
    downloaded: 0,
    total: 0,
    fileName: '',
  });
  const downloadCancelRef = useRef(false);
  const speedTrackerRef = useRef({ bytes: 0, startTime: Date.now() });

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
      // Filter duplicates by image ID to avoid React key conflicts
      const uniqueResults = (data.results || []).filter((image: ImageResult, index: number, self: ImageResult[]) => 
        index === self.findIndex((img) => img.id === image.id)
      );
      
      setSearchResults(uniqueResults);
      
      if (uniqueResults.length === 0) {
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

  const calculateSpeed = (bytesDownloaded: number, startTime: number): string => {
    const elapsed = (Date.now() - startTime) / 1000; // seconds
    if (elapsed === 0) return '0 B/s';
    const speed = bytesDownloaded / elapsed;
    return formatBytes(speed) + '/s';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    if (selectedImages.size === 0) {
      alert('Please select at least one image');
      return;
    }

    const imagesToDownload = searchResults.filter(img => selectedImages.has(img.id));
    downloadCancelRef.current = false;
    setIsDownloading(true);
    
    const fileName = `unsplash-photos-${Date.now()}.zip`;
    setDownloadProgress({
      progress: 0,
      speed: '0 B/s',
      downloaded: 0,
      total: 0,
      fileName,
    });

    try {
      const zip = new JSZip();
      let totalDownloaded = 0;
      let totalSize = 0;
      const startTime = Date.now();
      speedTrackerRef.current = { bytes: 0, startTime };

      // Estimate total size (rough estimate, will update as we download)
      // Start with a reasonable estimate, will be updated as we get actual sizes
      totalSize = imagesToDownload.length * 3 * 1024 * 1024; // Estimate 3MB per image initially

      // Download images and add to ZIP
      for (let i = 0; i < imagesToDownload.length; i++) {
        if (downloadCancelRef.current) {
          setIsDownloading(false);
          return;
        }

        const image = imagesToDownload[i];
        const imageStartTime = Date.now();

        try {
          // Download image with progress tracking
          const response = await fetch(image.urls.raw, {
            headers: {
              'User-Agent': 'Mozilla/5.0',
            },
          });

          if (!response.ok) {
            console.error(`Failed to download image ${image.id}`);
            continue;
          }

          const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
          if (contentLength > 0) {
            // Update total size with actual size for this image
            const estimatedPerImage = totalSize / imagesToDownload.length;
            totalSize = totalSize - estimatedPerImage + contentLength;
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No reader available');
          }

          const chunks: Uint8Array[] = [];
          let receivedLength = 0;

          while (true) {
            if (downloadCancelRef.current) {
              reader.cancel();
              setIsDownloading(false);
              return;
            }

            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            receivedLength += value.length;
            totalDownloaded += value.length;
            speedTrackerRef.current.bytes = totalDownloaded;

            // Update progress
            const progress = (totalDownloaded / totalSize) * 100;
            const speed = calculateSpeed(totalDownloaded, startTime);
            
            setDownloadProgress({
              progress: Math.min(progress, 99), // Cap at 99% until ZIP creation
              speed,
              downloaded: totalDownloaded,
              total: totalSize,
              fileName,
            });
          }

          // Combine chunks into single Uint8Array
          const allChunks = new Uint8Array(receivedLength);
          let position = 0;
          for (const chunk of chunks) {
            allChunks.set(chunk, position);
            position += chunk.length;
          }

          // Add to ZIP
          const filename = image.description 
            ? `${image.id}_${image.description.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}.jpg`
            : `${image.id}_${image.alt_description || 'photo'}.jpg`;
          
          zip.file(filename, allChunks);
        } catch (error) {
          console.error(`Error downloading image ${image.id}:`, error);
          continue;
        }
      }

      if (downloadCancelRef.current) {
        setIsDownloading(false);
        return;
      }

      // Generate ZIP file
      setDownloadProgress(prev => ({ ...prev, progress: 99, speed: 'Creating ZIP...' }));
      
      const zipBlob = await zip.generateAsync(
        { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
        (metadata) => {
          // Update progress during ZIP creation
          if (metadata.percent) {
            const finalProgress = 99 + (metadata.percent / 100);
            setDownloadProgress(prev => ({
              ...prev,
              progress: Math.min(finalProgress, 99.9),
            }));
          }
        }
      );

      // Final update
      setDownloadProgress({
        progress: 100,
        speed: 'Complete',
        downloaded: zipBlob.size,
        total: zipBlob.size,
        fileName,
      });

      // Small delay to show 100%
      await new Promise(resolve => setTimeout(resolve, 300));

      // Download the file
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsDownloading(false);
      setDownloadProgress({
        progress: 0,
        speed: '0 B/s',
        downloaded: 0,
        total: 0,
        fileName: '',
      });
    } catch (error) {
      console.error('Download error:', error);
      setIsDownloading(false);
      setError(error instanceof Error ? error.message : 'Download failed');
      setDownloadProgress({
        progress: 0,
        speed: '0 B/s',
        downloaded: 0,
        total: 0,
        fileName: '',
      });
    }
  };

  const handleCancelDownload = () => {
    downloadCancelRef.current = true;
    setIsDownloading(false);
    setDownloadProgress({
      progress: 0,
      speed: '0 B/s',
      downloaded: 0,
      total: 0,
      fileName: '',
    });
  };

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${isDownloading ? 'pb-24' : ''}`}>
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
            <Configuration 
              onConfigure={handleConfigure}
              savedAccessKey={accessKey}
              savedMode={mode}
            />
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
                  isDownloading={isDownloading}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {isDownloading && (
        <ProgressBar
          progress={downloadProgress.progress}
          speed={downloadProgress.speed}
          downloaded={downloadProgress.downloaded}
          total={downloadProgress.total}
          fileName={downloadProgress.fileName}
          onCancel={handleCancelDownload}
        />
      )}
      
      <Footer />
    </main>
  );
}

