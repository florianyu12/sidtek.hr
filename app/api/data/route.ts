import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

const AUTH_TOKEN = 'xitaikeji2025';

let cachedData = null;

function getCachedData() {
  if (!cachedData) {
    try {
      cachedData = getData();
      console.log('✅ Data loaded from file successfully');
    } catch (error) {
      console.error('❌ Failed to load data from file:', error);
      cachedData = null;
    }
  }
  return cachedData;
}

function verifyAuth(request: Request): boolean {
  const authToken = request.headers.get('x-auth-token');
  const isValid = authToken === AUTH_TOKEN;
  if (!isValid) {
    console.log('❌ Unauthorized request - invalid token');
  }
  return isValid;
}

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
  };
}

export async function OPTIONS() {
  console.log('🔄 OPTIONS request received');
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function GET() {
  try {
    const data = getCachedData();
    if (!data) {
      console.log('❌ No data available');
      return NextResponse.json({ error: 'No data available' }, { status: 500, headers: getCorsHeaders() });
    }
    console.log('✅ GET request successful');
    return NextResponse.json(data, { headers: getCorsHeaders() });
  } catch (error) {
    console.error('❌ GET request failed:', error);
    return NextResponse.json({ error: 'Failed to read data', details: String(error) }, { status: 500, headers: getCorsHeaders() });
  }
}

export async function PUT(request: Request) {
  console.log('📥 PUT request received');
  
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: getCorsHeaders() });
  }

  try {
    const data = await request.json();
    console.log('📝 Data received for saving:', Object.keys(data));
    cachedData = data;
    console.log('✅ Data saved successfully');
    return NextResponse.json({ success: true }, { headers: getCorsHeaders() });
  } catch (error) {
    console.error('❌ PUT request failed:', error);
    return NextResponse.json({ error: 'Failed to save data', details: String(error) }, { status: 500, headers: getCorsHeaders() });
  }
}
