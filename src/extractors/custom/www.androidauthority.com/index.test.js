import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwAndroidauthorityComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url = 'https://www.androidauthority.com/new-android-apps-658839/';
      const html = fs.readFileSync(
        './fixtures/www.androidauthority.com/1734492467424.html'
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
      // in ./src/extractors/custom/www.androidauthority.com/index.js.
      const { title } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        title,
        `The best new Android apps and games for December 2024`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Andy Walker');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2024-11-30T17:02:18.000Z`);
    });

    it('returns the lead_image_url', async () => {
      // To pass this test, fill out the lead_image_url selector
      // in ./src/extractors/custom/www.androidauthority.com/index.js.
      const { lead_image_url } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        lead_image_url,
        `https://www.androidauthority.com/wp-content/uploads/2024/11/clean-as-duck-icon-1.jpg`
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
        'Many new Android apps are out there. Keeping track of them is tough,'
      );
    });
  });
});
