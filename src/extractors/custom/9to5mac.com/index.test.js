import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('9to5macComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://9to5mac.com/2025/06/10/apple-notes-is-coming-to-your-apple-watch-in-watchos-26/';
      const html = fs.readFileSync(
        './fixtures/9to5mac.com/1749691994435.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(
        title,
        `Apple Notes is coming to your Apple Watch in watchOS 26`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Ryan Christoffel');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-06-10T15:48:24.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://i0.wp.com/9to5mac.com/wp-content/uploads/sites/6/2025/06/apple-notes-app-watchos-26.jpg?resize=1200%2C628&quality=82&strip=all&ssl=1`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent(
        $('*')
          .first()
          .text(),
        13
      );

      assert.strictEqual(
        first13,
        'watchOS 26 is the next major software update coming for Apple Watch, and'
      );
    });
  });
});
