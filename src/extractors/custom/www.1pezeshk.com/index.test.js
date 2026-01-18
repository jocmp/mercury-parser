import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('Www1pezeshkComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.1pezeshk.com/archives/2024/12/the-battle-of-dogs-utilizing-animals-in-warfare.html';
      const html = fs.readFileSync(
        './fixtures/www.1pezeshk.com/1733537734038.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      // This test should be passing by default.
      // It sanity checks that the correct parser
      // is being selected for URLs from this domain
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      // To pass this test, fill out the title selector
      // in ./src/extractors/custom/www.1pezeshk.com/index.js.
      const { title } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(title, `نبرد سگ‌ها: استفاده از حیوانات در میدان جنگ`);
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'علیرضا مجیدی');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2024-12-06T21:30:19.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        'https://www.1pezeshk.com/wp-content/uploads/2024/12/12-09-1403-08-52-01-%D8%A8-%D8%B8.webp'
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
        'در طول تاریخ، حیوانات همواره در میدان‌های نبرد در کنار انسان‌ها حضور داشته‌اند.'
      );
    });
  });
});
