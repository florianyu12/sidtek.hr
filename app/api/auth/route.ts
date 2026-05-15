import { NextResponse } from 'next/server';

const AUTH_TOKEN = 'xitaikeji2025';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (token === AUTH_TOKEN) {
      return NextResponse.json({ success: true, token: AUTH_TOKEN });
    }

    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
