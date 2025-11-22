import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

interface Topic {
  name: string;
  folder: string;
  count: number;
}

async function downloadPhoto(accessKey: string, topic: string, index: number): Promise<Buffer> {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(topic)}&orientation=landscape&client_id=${accessKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch photo: ${response.statusText}`);
  }

  const data = await response.json();
  const imageUrl = data.urls?.raw;
  
  if (!imageUrl) {
    throw new Error('No image URL found in response');
  }

  const imageResponse = await fetch(imageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });

  if (!imageResponse.ok) {
    throw new Error(`Failed to download image: ${imageResponse.statusText}`);
  }

  const arrayBuffer = await imageResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const { accessKey, mode, topics } = await request.json();

    if (!accessKey || !topics || !Array.isArray(topics)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const zip = new JSZip();
    const rateLimit = mode === 'demo' ? 50 : 5000;
    const delay = Math.ceil(3600000 / rateLimit); // Delay in milliseconds

    for (const topic of topics) {
      if (!topic.name || !topic.folder || topic.count <= 0) {
        continue;
      }

      const folder = zip.folder(topic.folder);
      if (!folder) {
        continue;
      }

      for (let i = 1; i <= topic.count; i++) {
        try {
          const imageBuffer = await downloadPhoto(accessKey, topic.name, i);
          folder.file(`${topic.name}_${i}.jpg`, imageBuffer);
          
          // Rate limiting delay
          if (i < topic.count) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (error) {
          console.error(`Error downloading ${topic.name} photo #${i}:`, error);
          // Continue with next photo
        }
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
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

