import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unsplash Photo Downloader",
  description: "Download high-resolution photos from Unsplash and get them as a ZIP file",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

