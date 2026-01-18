import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwPolygonComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.polygon.com/diablo-4-guides/565876/reliquary-battle-pass-explained-rewards';
      const html = fs.readFileSync(
        './fixtures/www.polygon.com/1746405751338.html',
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

      assert.strictEqual(
        title,
        `All Reliquary battle pass items in Diablo 4 season`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Ryan Gilliam`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-04-29T20:28:54.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://platform.polygon.com/wp-content/uploads/sites/2/2025/04/Reliqauryseason8rewards.png?quality=90&strip=all&crop=0%2C3.5183474204109%2C100%2C92.963305159178&w=1200`
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
        'The Reliquary is an updated version of Diablo 4’s battle pass, debuting with'
      );
    });

    it('retains images', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');
      const images = $('img');

      assert.strictEqual(images.length, 5);
    });
  });
});
