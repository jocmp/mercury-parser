import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Mercury from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('DeadlineComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://deadline.com/2019/04/donald-trump-boeing-max-737-rebrand-advice-twitter-1202595880/';
      const html = fs.readFileSync('./fixtures/deadline.com.html');
      result = Mercury.parse(url, {
        html,
        fallback: false,
      });
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
      // in ./src/extractors/custom/deadline.com/index.js.
      const { title } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        title.split('Twitter')[0],
        `Donald Trump Advises Boeing To Rebrand Max 737, Tweeting “But What The Hell Do I Know?”; `
      );
    });

    it('returns the author', async () => {
      // To pass this test, fill out the author selector
      // in ./src/extractors/custom/deadline.com/index.js.
      const { author } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(author, 'Lisa de Moraes');
    });

    it('returns the date_published', async () => {
      // To pass this test, fill out the date_published selector
      // in ./src/extractors/custom/deadline.com/index.js.
      const { date_published } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(date_published, `2019-04-15T13:18:34.000Z`);
    });

    it('returns the dek', async () => {
      // To pass this test, fill out the dek selector
      // in ./src/extractors/custom/deadline.com/index.js.
      const { dek } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(dek, null);
    });

    it('returns the lead_image_url', async () => {
      // To pass this test, fill out the lead_image_url selector
      // in ./src/extractors/custom/deadline.com/index.js.
      const { lead_image_url } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        lead_image_url,
        `https://deadline.com/wp-content/uploads/2019/01/donald-trump-2-e1561600955862.jpg?w=1024`
      );
    });

    it('returns the content', async () => {
      // To pass this test, fill out the content selector
      // in ./src/extractors/custom/deadline.com/index.js.
      // You may also want to make use of the clean and transform
      // options.
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent(
        $('*')
          .first()
          .text(),
        13
      );

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        first13,
        'Twitter erupted Monday morning when President Donald Trump shared his branding expertise with'
      );
    });
  });
});
