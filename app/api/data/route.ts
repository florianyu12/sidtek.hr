import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

const AUTH_TOKEN = 'xitaikeji2025';

let cachedData = null;

function getCachedData() {
  if (!cachedData) {
    cachedData = getData();
  }
  return cachedData;
}

function verifyAuth(request: Request): boolean {
  const authToken = request.headers.get('x-auth-token');
  return authToken === AUTH_TOKEN;
}

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function GET() {
  try {
    const data = getCachedData();
    return NextResponse.json(data, { headers: getCorsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500, headers: getCorsHeaders() });
  }
}

export async function PUT(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: getCorsHeaders() });
  }

  try {
    const data = await request.json();
    cachedData = data;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500, headers: getCorsHeaders() });
  }
}
