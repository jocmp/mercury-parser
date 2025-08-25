import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwThehinduComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.thehindu.com/sci-tech/technology/learn-to-play-around-with-ai-tools-and-get-fluent-microsoft-india-president-advises/article69973813.ece';
      const html = fs.readFileSync(
        './fixtures/www.thehindu.com/1756099741327.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      // This test should be passing by default.
      // It sanity checks that the correct parser
      // is being selected for URLs from this domain
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      // To pass this test, fill out the title selector
      // in ./src/extractors/custom/www.thehindu.com/index.js.
      const { title } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        title,
        `Learn to play around with AI tools and get fluent, Microsoft India President advises`
      );
    });

    it('returns the author', async () => {
      // To pass this test, fill out the author selector
      // in ./src/extractors/custom/www.thehindu.com/index.js.
      const { author } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(author, `PTI`);
    });

    it('returns the date_published', async () => {
      // To pass this test, fill out the date_published selector
      // in ./src/extractors/custom/www.thehindu.com/index.js.
      const { date_published } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(date_published, `2025-08-25T03:36:10.000Z`);
    });

    it('returns the dek', async () => {
      // To pass this test, fill out the dek selector
      // in ./src/extractors/custom/www.thehindu.com/index.js.
      const { dek } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(dek, null);
    });

    it('returns the lead_image_url', async () => {
      // To pass this test, fill out the lead_image_url selector
      // in ./src/extractors/custom/www.thehindu.com/index.js.
      const { lead_image_url } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        lead_image_url,
        `https://th-i.thgim.com/public/incoming/98079s/article69973816.ece/alternates/LANDSCAPE_1200/2025-07-31T084055Z_2126348847_RC29TY9OKS5Q_RTRMADP_3_TECH-RESULTS-AI.JPG`
      );
    });

    it('returns the content', async () => {
      // To pass this test, fill out the content selector
      // in ./src/extractors/custom/www.thehindu.com/index.js.
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

      // Update these values with the expected values from the article.
      // Add the first 13 words of the article here
      assert.strictEqual(
        first13,
        'Microsoft India President Puneet Chandok has urged the youth to build on AI'
      );
    });
  });
});
