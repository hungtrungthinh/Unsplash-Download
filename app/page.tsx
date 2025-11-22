'use client';

import { useState } from 'react';
import Configuration from '@/components/Configuration';
import Downloader from '@/components/Downloader';

export default function Home() {
  const [accessKey, setAccessKey] = useState('');
  const [mode, setMode] = useState<'demo' | 'production'>('demo');
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConfigure = (key: string, selectedMode: 'demo' | 'production') => {
    setAccessKey(key);
    setMode(selectedMode);
    setIsConfigured(true);
  };

  const handleReset = () => {
    setAccessKey('');
    setMode('demo');
    setIsConfigured(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Unsplash Photo Downloader
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Download high-resolution photos from Unsplash and get them as a ZIP file
            </p>
          </div>

          {!isConfigured ? (
            <Configuration onConfigure={handleConfigure} />
          ) : (
            <Downloader 
              accessKey={accessKey} 
              mode={mode} 
              onReset={handleReset} 
            />
          )}
        </div>
      </div>
    </main>
  );
}

