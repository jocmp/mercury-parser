import Mercury from 'mercury';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, html } = await request.json();

    if (!url) {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await Mercury.parse(url, { html });

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Parse failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
