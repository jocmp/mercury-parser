import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('SgNewsYahooComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://sg.news.yahoo.com/mcdonald-pore-launches-chilli-crab-064000706.html';
      const html = fs.readFileSync(
        './fixtures/sg.news.yahoo.com/1752437547267.html'
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
        `McDonald’s S’pore launches Chilli Crab Sauce Burger with Jumbo Seafood to celebrate SG60`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Straits Times');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-07-08T01:40:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://s.yimg.com/ny/api/res/1.2/klrThoKAhKQ8vL2o0VQqeg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD05Mjg-/https://media.zenfs.com/en/straits_times_442/2a1ffe0578e7b12585354cef7aca6be3`
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
        'The Chilli Crab Sauce Prawn Burger features a prawn patty topped with a'
      );
    });
  });
});
