'use client';

interface ProgressBarProps {
  progress: number; // 0-100
  speed: string; // e.g., "2.5 MB/s"
  downloaded: number; // bytes downloaded
  total: number; // total bytes
  fileName?: string;
  onCancel?: () => void;
}

export default function ProgressBar({ 
  progress, 
  speed, 
  downloaded, 
  total, 
  fileName,
  onCancel 
}: ProgressBarProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const downloadedFormatted = formatBytes(downloaded);
  const totalFormatted = formatBytes(total);
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            {fileName && (
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                {fileName}
              </div>
            )}
            <div className="flex items-center gap-3 mb-1">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[60px] text-right">
                {percentage.toFixed(1)}%
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{downloadedFormatted} / {totalFormatted}</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{speed}</span>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

