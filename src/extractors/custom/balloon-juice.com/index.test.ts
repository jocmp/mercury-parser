import assert from 'assert';
import URL from 'url';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';

const fs = require('fs');

describe('BalloonJuiceComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://balloon-juice.com/2026/02/02/schadenfreude-open-thread-gop-fire-drill/';
      const html = fs.readFileSync(
        './fixtures/balloon-juice.com/1738548463000.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(
        title,
        `Schadenfreude Open Thread: GOP / Trumpist Fire Drill`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Anne Laurie`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-02-02T21:23:25.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://balloon-juice.com/wp-content/uploads/2015/07/tunchiswatching.jpg`
      );
    });

    it('returns the content with bluesky iframes marked for preservation', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const iframeCount = $('iframe[src*="embed.bsky.app"]').length;
      assert.ok(iframeCount > 0, 'Should contain bluesky embed iframes');

      const markedCount = $('iframe.iframe-embed-bsky').length;
      assert.strictEqual(
        markedCount,
        iframeCount,
        'All bluesky iframes should have iframe-embed-bsky class'
      );
    });
  });
});
