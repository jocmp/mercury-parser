import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Mercury from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('QzComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://qz.com/africa/1807355/nigerias-economy-has-best-quarterly-growth-since-recession/';
      const html = fs.readFileSync('./fixtures/qz.com.html');
      result = Mercury.parse(url, { html, fallback: false });
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
      // in ./src/extractors/custom/qz.com/index.js.
      const { title } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        title,
        'Nigeria’s economy is making a comeback—but it’s still not happening fast enough'
      );
    });

    // Author is no longer being returned in meta tag and there is no consistent selector for author byline (confirmed by viewing several articles)
    // it('returns the author', async () => {
    //   // To pass this test, fill out the author selector
    //   // in ./src/extractors/custom/qz.com/index.js.
    //   const { author } = await result;

    //   // Update these values with the expected values from
    //   // the article.
    //   assert.strictEqual(author, 'Yomi Kazeem');
    // });

    it('returns the date_published', async () => {
      // To pass this test, fill out the date_published selector
      // in ./src/extractors/custom/qz.com/index.js.
      const { date_published } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(date_published, '2020-02-24T16:26:29.000Z');
    });

    it('returns the lead_image_url', async () => {
      // To pass this test, fill out the lead_image_url selector
      // in ./src/extractors/custom/qz.com/index.js.
      const { lead_image_url } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        lead_image_url,
        'https://i.kinja-img.com/gawker-media/image/upload/q_75,w_1200,h_630,c_fill/e88c932321f288c23cf86931e591aa71.JPG'
      );
    });

    it('returns the content', async () => {
      // To pass this test, fill out the content selector
      // in ./src/extractors/custom/qz.com/index.js.
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
        'Since suffering a recession and full year of negative growth in 2016, Nigeria,'
      );
    });
  });
});
