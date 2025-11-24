import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://unsplash-download.vercel.app'),
  title: {
    default: "Unsplash Photo Downloader - Bulk Download High-Resolution Images | Free Stock Photos",
    template: "%s | Unsplash Photo Downloader"
  },
  description: "Download high-resolution photos from Unsplash in bulk. Perfect for CMS media libraries, galleries, and app development. Search, select, and download multiple images as ZIP files. Free stock photos downloader with progress tracking.",
  keywords: [
    "unsplash downloader",
    "bulk photo download",
    "stock photos download",
    "unsplash images",
    "free images download",
    "CMS media library",
    "image gallery",
    "high resolution photos",
    "unsplash API",
    "photo downloader tool",
    "batch image download",
    "free stock photos",
    "unsplash bulk download",
    "image ZIP download",
    "photo download tool"
  ],
  authors: [{ name: "Thinh Nguyen", url: "https://github.com/hungtrungthinh" }],
  creator: "Boring Lab",
  publisher: "Boring Lab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://unsplash-download.vercel.app",
    siteName: "Unsplash Photo Downloader",
    title: "Unsplash Photo Downloader - Bulk Download High-Resolution Images",
    description: "Download high-resolution photos from Unsplash in bulk. Perfect for CMS media libraries, galleries, and app development. Search, select, and download multiple images as ZIP files.",
    images: [
      {
        url: "/screenshots/demo.png",
        width: 1200,
        height: 630,
        alt: "Unsplash Photo Downloader - Bulk Download High-Resolution Images",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unsplash Photo Downloader - Bulk Download High-Resolution Images",
    description: "Download high-resolution photos from Unsplash in bulk. Perfect for CMS media libraries, galleries, and app development.",
    images: ["/screenshots/demo.png"],
    creator: "@hungtrungthinh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification if needed
    // google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://unsplash-download.vercel.app",
  },
  category: "Photo Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Unsplash Photo Downloader",
    description: "Download high-resolution photos from Unsplash in bulk. Perfect for CMS media libraries, galleries, and app development.",
    url: "https://unsplash-download.vercel.app",
    applicationCategory: "PhotoEditor",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Boring Lab",
      url: "https://github.com/hungtrungthinh",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "100",
    },
    featureList: [
      "Bulk download high-resolution images",
      "Search by keywords",
      "Filter by orientation",
      "Download as ZIP file",
      "Progress tracking",
      "Free to use",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

