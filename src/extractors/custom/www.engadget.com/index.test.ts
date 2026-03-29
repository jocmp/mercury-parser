import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwEngadgetComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.engadget.com/gaming/the-studio-that-technically-made-disco-elysium-has-a-new-game-in-the-works-185218695.html';
      const html = fs.readFileSync(
        './fixtures/www.engadget.com/1741829174040.html',
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
        `The studio that (technically) made Disco Elysium has a new game in the works`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `lawrence bonk`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-03-11T18:52:18.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://s.yimg.com/ny/api/res/1.2/qYT1K03yV7amXYyq1nuaOw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NjM-/https://s.yimg.com/os/creatr-uploaded-images/2025-03/1723f9a0-fea4-11ef-baf7-8318addd3ced`
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
        'ZA/UM Studio, the company behind Disco Elysium, just announced a new game called'
      );
    });

    it('returns an iframe', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const iframe = $('*').find('.youtube iframe');

      assert.strictEqual(
        iframe.attr('src'),
        'https://www.youtube.com/embed/kz9apwrMKi8?si=soW8kI30UvDFHtX7'
      );
    });
  });
});
