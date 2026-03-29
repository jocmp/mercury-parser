import assert from 'assert';
import * as cheerio from 'cheerio';

import GenericUrlExtractor from './extractor';

describe('GenericUrlExtractor', () => {
  describe('extract({ $, url })', () => {
    it('returns canonical url and domain first', () => {
      const fullUrl =
        'https://example.com/blog/post?utm_campain=poajwefpaoiwjefaepoj';
      const clean = 'https://example.com/blog/post';
      const html = `
        <html>
          <head>
            <link rel="canonical" href="${clean}" />
            <meta name="og:url" value="${clean}" />
          </head>
        </html>
      `;
      const $ = cheerio.load(html);

      const { url, domain } = GenericUrlExtractor.extract({ $, url: fullUrl });

      assert.strictEqual(url, clean);
      assert.strictEqual(domain, 'example.com');
    });

    it('returns og:url second', () => {
      const fullUrl =
        'https://example.com/blog/post?utm_campain=poajwefpaoiwjefaepoj';
      const clean = 'https://example.com/blog/post';
      const html = `
        <html>
          <head>
            <meta name="og:url" value="${clean}" />
          </head>
        </html>
      `;
      const $ = cheerio.load(html);
      const metaCache = ['og:url'];

      const { url, domain } = GenericUrlExtractor.extract({
        $,
        url: fullUrl,
        metaCache,
      });

      assert.strictEqual(url, clean);
      assert.strictEqual(domain, 'example.com');
    });

    it('returns passed url if others are not found', () => {
      const fullUrl =
        'https://example.com/blog/post?utm_campain=poajwefpaoiwjefaepoj';
      const html = `
        <html>
          <head>
          </head>
        </html>
      `;
      const $ = cheerio.load(html);
      const metaCache = [];

      const { url, domain } = GenericUrlExtractor.extract({
        $,
        url: fullUrl,
        metaCache,
      });

      assert.strictEqual(url, fullUrl);
      assert.strictEqual(domain, 'example.com');
    });
  });
});
