import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('Nineto5googleComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://9to5google.com/2025/02/28/google-pixel-9a-wallpapers-leak/';
      const html = fs.readFileSync(
        './fixtures/9to5google.com/1740950813179.html'
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
        `Another set of Pixel 9a wallpapers leak with some new color combos [Gallery]`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Ben Schoon');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-02-28T16:45:00.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://i0.wp.com/9to5google.com/wp-content/uploads/sites/4/2025/02/pixel-9a-wf-leak-17.jpg?resize=1200%2C628&quality=82&strip=all&ssl=1`
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
        'Ahead of its upcoming launch, another set of wallpapers allegedly coming with the'
      );
    });
  });
});
