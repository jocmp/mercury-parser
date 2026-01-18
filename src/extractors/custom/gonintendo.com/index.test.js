import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('GonintendoComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://gonintendo.com/contents/52827-former-capcom-dev-defends-game-key-cards-says-nintendo-is-trying-to-protect-the-game';
      const html = fs.readFileSync(
        './fixtures/gonintendo.com/1762111318191.html',
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
        `Former Capcom dev defends Game-Key Cards, says Nintendo is trying to "protect the game industry"`
      );
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-09-12T19:01:00.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://gonintendo.com/contents/52827-former-capcom-dev-defends-game-key-cards-says-nintendo-is-trying-to-protect-the-game`
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
        'There has been no other Switch 2 topic more rage-inducing than that of'
      );
    });
  });
});
