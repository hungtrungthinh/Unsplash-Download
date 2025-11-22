import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessKey } = await request.json();

    if (!accessKey || typeof accessKey !== 'string' || accessKey.trim() === '') {
      return NextResponse.json(
        { valid: false, error: 'Access Key is required' },
        { status: 400 }
      );
    }

    if (accessKey === 'YOUR_ACCESS_KEY') {
      return NextResponse.json(
        { valid: false, error: 'Please replace YOUR_ACCESS_KEY with your actual Access Key' },
        { status: 400 }
      );
    }

    // Validate Access Key by making a simple API call to Unsplash
    // Using a lightweight endpoint that doesn't require much data
    const testUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey.trim()}&count=1`;
    
    const response = await fetch(testUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = 'Invalid Access Key';
      
      if (response.status === 401 || response.status === 403) {
        errorMessage = 'Invalid or unauthorized Access Key. Please check your Access Key and make sure it is correct.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else {
        try {
          const errorData = await response.json();
          if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0];
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // Use default error message
        }
      }

      return NextResponse.json(
        { valid: false, error: errorMessage, status: response.status },
        { status: 200 } // Return 200 so client can handle the validation result
      );
    }

    // If we get here, the Access Key is valid
    return NextResponse.json({
      valid: true,
      message: 'Access Key is valid',
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: error instanceof Error ? error.message : 'An error occurred while validating Access Key' 
      },
      { status: 200 }
    );
  }
}

