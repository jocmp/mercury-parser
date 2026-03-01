import Mercury from 'mercury';
import { NextRequest } from 'next/server';
// @ts-ignore
import GenericExtractor from 'extractors/generic';
// @ts-ignore
import RootExtractor from 'extractors/root-extractor';
// @ts-ignore
import Resource from 'resource';
import { parse as parseUrl } from 'url';

export async function POST(request: NextRequest) {
  try {
    const { url, html, forceDefault } = await request.json();

    if (!url) {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }

    let result;

    if (forceDefault) {
      const parsedUrl = parseUrl(url);
      const $ = await Resource.create(url, html, parsedUrl, {});
      if ($.failed) {
        return Response.json(
          { error: $.message || 'Failed to fetch' },
          { status: 500 }
        );
      }
      const fetchedHtml = html || $.html();
      const metaCache = $('meta')
        .map((_: any, node: any) => $(node).attr('name'))
        .toArray();
      result = RootExtractor.extract(GenericExtractor, {
        url,
        html: fetchedHtml,
        $,
        metaCache,
        parsedUrl,
        fallback: false,
      });
      result = { ...result, total_pages: 1, rendered_pages: 1 };
    } else {
      result = await Mercury.parse(url, { html });
    }

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Parse failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
