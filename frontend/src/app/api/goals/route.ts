import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization');
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/goals`, {
      headers: {
        'Authorization': token || '',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization');
  const body = await request.json();
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
