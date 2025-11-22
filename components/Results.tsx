'use client';

import Image from 'next/image';

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

interface ResultsProps {
  images: ImageResult[];
  selectedImages: Set<string>;
  onImageSelect: (imageId: string) => void;
  onSelectAll: () => void;
  onDownload: () => void;
}

export default function Results({ images, selectedImages, onImageSelect, onSelectAll, onDownload }: ResultsProps) {
  const allSelected = selectedImages.size === images.length && images.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Search Results
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Found {images.length} photos • {selectedImages.size} selected
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={onDownload}
            disabled={selectedImages.size === 0}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Download ZIP ({selectedImages.size})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => {
          const isSelected = selectedImages.has(image.id);
          return (
            <div
              key={image.id}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
              onClick={() => onImageSelect(image.id)}
            >
              <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
                <Image
                  src={image.urls.thumb}
                  alt={image.alt_description || image.description || 'Unsplash photo'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                    <div className="bg-indigo-600 text-white rounded-full p-2">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              {image.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs truncate">{image.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No results found</p>
        </div>
      )}
    </div>
  );
}

