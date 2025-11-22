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
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Unsplash-Downloader/1.0',
      },
    });
    
    if (!response.ok) {
      let errorMessage = `Unsplash API error: ${response.statusText}`;
      let errorDetails = '';
      
      // Read response body only once
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
          
          // Extract error message from Unsplash API response if available
          if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0];
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } else {
          errorDetails = await response.text();
        }
      } catch (e) {
        errorDetails = 'Unable to read error details';
      }
      
      // Provide more helpful error messages based on status code
      if (response.status === 401 || response.status === 403) {
        errorMessage = 'Invalid or unauthorized Access Key. Please check your Access Key and make sure it is correct.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later or upgrade to Production API.';
      }
      
      console.error('Unsplash API Error:', {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails,
        url: url.replace(accessKey, 'HIDDEN'),
      });
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          details: errorDetails,
          status: response.status,
        },
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

