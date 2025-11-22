'use client';

import { useState } from 'react';

interface DownloaderProps {
  accessKey: string;
  mode: 'demo' | 'production';
  onReset: () => void;
}

interface Topic {
  name: string;
  folder: string;
  count: number;
}

export default function Downloader({ accessKey, mode, onReset }: DownloaderProps) {
  const [topics, setTopics] = useState<Topic[]>([
    { name: 'technology', folder: 'technology', count: 10 },
    { name: 'nature', folder: 'nature', count: 10 },
    { name: 'city', folder: 'city', count: 10 },
  ]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');

  const handleTopicChange = (index: number, field: keyof Topic, value: string | number) => {
    const updated = [...topics];
    updated[index] = { ...updated[index], [field]: value };
    setTopics(updated);
  };

  const addTopic = () => {
    setTopics([...topics, { name: '', folder: '', count: 10 }]);
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleDownload = async () => {
    if (topics.length === 0) {
      setError('Please add at least one topic');
      return;
    }

    const invalidTopics = topics.filter(t => !t.name.trim() || !t.folder.trim() || t.count <= 0);
    if (invalidTopics.length > 0) {
      setError('Please fill in all topic fields correctly');
      return;
    }

    const total = topics.reduce((sum, t) => sum + t.count, 0);
    setIsDownloading(true);
    setError('');
    setProgress({ current: 0, total });

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKey,
          mode,
          topics,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Simulate progress while downloading
      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
          // Update progress based on received data (rough estimate)
          setProgress({ current: Math.min(Math.floor((receivedLength / 1000000) * total), total), total });
        }
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unsplash-photos-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setProgress({ current: total, total });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDownloading(false);
    }
  };

  const totalPhotos = topics.reduce((sum, t) => sum + t.count, 0);
  const rateLimit = mode === 'demo' ? 50 : 5000;
  const estimatedTime = Math.ceil(totalPhotos / rateLimit * 60);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Download Photos
          </h2>
          <button
            onClick={onReset}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Change Configuration
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Mode:</strong> {mode === 'demo' ? 'Demo API' : 'Production API'} 
            ({rateLimit} requests/hour)
          </p>
        </div>

        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic.name}
                  onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                  placeholder="e.g., technology"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={topic.folder}
                  onChange={(e) => handleTopicChange(index, 'folder', e.target.value)}
                  placeholder="e.g., technology"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={topic.count}
                  onChange={(e) => handleTopicChange(index, 'count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => removeTopic(index)}
                  className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addTopic}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
          >
            + Add Topic
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Total photos:</strong> {totalPhotos} 
            {mode === 'demo' && totalPhotos > 50 && (
              <span className="text-red-600 dark:text-red-400 ml-2">
                (Warning: Exceeds Demo API limit of 50/hour)
              </span>
            )}
          </p>
        </div>

        {isDownloading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Downloading...</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <button
          onClick={handleDownload}
          disabled={isDownloading || totalPhotos === 0}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {isDownloading ? 'Downloading...' : `Download ${totalPhotos} Photos as ZIP`}
        </button>
      </div>
    </div>
  );
}

