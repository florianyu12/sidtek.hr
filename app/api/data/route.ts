import { NextResponse } from 'next/server';
import { getData, saveData } from '@/lib/data';

const AUTH_TOKEN = 'xitaikeji2025';

function verifyAuth(request: Request): boolean {
  const authToken = request.headers.get('x-auth-token');
  return authToken === AUTH_TOKEN;
}

export async function GET() {
  try {
    const data = getData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    saveData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
