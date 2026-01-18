import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

// Flaky
// eslint-disable-next-line no-undef
xdescribe('WwwTechpowerupComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.techpowerup.com/review/valkyrie-v240-lite-aio-liquid-cpu-cooler/';
      const html = fs.readFileSync(
        './fixtures/www.techpowerup.com/1747598930208.html',
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

      assert.strictEqual(title, `Valkyrie V240 LITE Review`);
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `crazyeyesreaper`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-05-16T14:15:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://www.techpowerup.com/review/valkyrie-v240-lite-aio-liquid-cpu-cooler/images/title.jpg`
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
        'Introduction A big thank you to Valkyrie for providing the review sample! Valkyrie'
      );
    });
  });
});
