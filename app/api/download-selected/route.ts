import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

interface ImageData {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
  };
  description?: string;
  alt_description?: string;
}

async function downloadImage(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No images selected' },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    for (let i = 0; i < images.length; i++) {
      const image: ImageData = images[i];
      try {
        // Use raw URL for highest quality
        const imageBuffer = await downloadImage(image.urls.raw);
        const filename = image.description 
          ? `${image.id}_${image.description.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}.jpg`
          : `${image.id}_${image.alt_description || 'photo'}.jpg`;
        
        zip.file(filename, imageBuffer);
      } catch (error) {
        console.error(`Error downloading image ${image.id}:`, error);
        // Continue with next image
      }
    }

    // Use arraybuffer type for Vercel compatibility
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
    
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="unsplash-photos-${Date.now()}.zip"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

