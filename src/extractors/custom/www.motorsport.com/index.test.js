import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwMotorsportComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.motorsport.com/f1/news/very-unfortunate-isack-hadjar-crash-leaves-red-bull-undecided-on-third-f1-test-day/10793339/?utm_source=RSS&utm_medium=referral&utm_campaign=RSS-F1&utm_term=News&utm_content=www';
      const html = fs.readFileSync(
        './fixtures/www.motorsport.com/1770093049254.html'
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
        `"Very unfortunate" Isack Hadjar crash leaves Red Bull undecided on third F1 test day`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Filip Cleeren');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-01-27T20:16:22.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        `Hadjar crashed his Red Bull RB22 on a treacherous wet second day of Formula 1's Barcelona shakedown`
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn-2.motorsport.com/images/amp/01QdMbx0/s6/isack-hadjar-red-bull-racing.jpg`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'The Red Bull Formula 1 team is still evaluating its plans for a'
      );
    });
  });
});
