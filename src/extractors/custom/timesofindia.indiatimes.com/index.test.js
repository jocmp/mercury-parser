import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Mercury from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('TimesofindiaIndiatimesComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://timesofindia.indiatimes.com/india/china-snubs-imran-says-resolve-jk-bilaterally/articleshow/71496416.cms';
      const html = fs.readFileSync(
        './fixtures/timesofindia.indiatimes.com.html'
      );
      result = Mercury.parse(url, { html, fallback: true });
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
      // in ./src/extractors/custom/timesofindia.indiatimes.com/index.js.
      const { title } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        title,
        `China snubs Imran Khan, says resolve J&K bilaterally`
      );
    });

    it('returns the author', async () => {
      // To pass this test, fill out the author selector
      // in ./src/extractors/custom/timesofindia.indiatimes.com/index.js.
      const { author } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(author, `Saibal Dasgupta`);
    });

    it('returns the date_published', async () => {
      // To pass this test, fill out the date_published selector
      // in ./src/extractors/custom/timesofindia.indiatimes.com/index.js.
      const { date_published } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(date_published, '2019-10-09T05:35:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      // To pass this test, fill out the lead_image_url selector
      // in ./src/extractors/custom/timesofindia.indiatimes.com/index.js.
      const { lead_image_url } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        lead_image_url,
        `https://static.toiimg.com/thumb/msid-71496420,width-1070,height-580,imgsize-83878,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg`
      );
    });

    it('returns the content', async () => {
      // To pass this test, fill out the content selector
      // in ./src/extractors/custom/timesofindia.indiatimes.com/index.js.
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
        'This story is from October 9, 2019AA+Text SizeSmallMediumLargeChina snubs Imran Khan, says resolve'
      );
    });
  });
});
