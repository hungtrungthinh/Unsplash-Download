import { NextRequest, NextResponse } from 'next/server';

interface SearchParams {
  accessKey: string;
  query: string;
  orientation?: string;
  perPage?: number;
  page?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { accessKey, query, orientation = 'all', perPage = 20, page = 1 } = await request.json();

    if (!accessKey || !query) {
      return NextResponse.json(
        { error: 'Access key and query are required' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      query: query.trim(),
      client_id: accessKey,
      per_page: perPage.toString(),
      page: page.toString(),
    });

    if (orientation !== 'all') {
      params.append('orientation', orientation);
    }

    const url = `https://api.unsplash.com/search/photos?${params.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Unsplash API error: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      results: data.results || [],
      total: data.total || 0,
      totalPages: data.total_pages || 0,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

