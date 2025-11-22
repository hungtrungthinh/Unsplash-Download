'use client';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              About This Tool
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              This Unsplash Photo Downloader helps you download high-resolution images from Unsplash 
              in bulk, perfect for demo media CMS, galleries, or any application development needs. 
              Quickly search, select, and download multiple images as a ZIP file to streamline your 
              workflow when building apps or CMS platforms.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Use Cases
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Bulk download images for CMS media libraries</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Create image galleries for application demos</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Quick access to high-quality stock photos</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Streamline development workflow with batch downloads</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2023 Boring Lab. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 md:mt-0">
              Built with Next.js 16 • Powered by Unsplash API
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

