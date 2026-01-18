import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();

    return Response.json({ html });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fetch failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
