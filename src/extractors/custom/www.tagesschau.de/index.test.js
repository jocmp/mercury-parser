import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwTagesschauDeExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.tagesschau.de/ausland/europa/ukraine-gipfel-london-106.html';
      const html = fs.readFileSync(
        './fixtures/www.tagesschau.de/1740949702394.html',
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

      assert.strictEqual(title, `"Koalition der Willigen" formiert sich`);
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, null);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-03-02T19:53:57.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://images.tagesschau.de/image/a2422a7b-392f-40cb-8766-aba4608520e2/AAABlVg7HWU/AAABkZLhkrw/16x9-1280/ukraine-gipfel-126.jpg`
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
        'Nach dem Eklat im Weißen Haus wollen Großbritannien und Frankreich vorangehen, um eine'
      );
    });
  });
});
