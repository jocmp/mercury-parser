import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwDwComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.dw.com/en/germany-start-2026-world-cup-with-win-over-curacao/a-77538843';
      const html = fs.readFileSync('./fixtures/www.dw.com/1781467709395.html');
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
        `Germany start 2026 World Cup with win over Curacao`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Jonathan Harding`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-06-14T19:00:01.536Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'For the first time since they won the tournament in 2014, Germany won their opening game at the World Cup.'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://static.dw.com/image/77549352_6.jpg`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'Now that the 2026 World Cup has started, the show element of this'
      );
    });

    it('resolves responsive image URLs', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');
      const images = $('img').toArray();

      assert.ok(images.length > 0, 'expected inline images in the content');
      images.forEach(img => {
        const src = $(img).attr('src') || '';
        assert.ok(
          !/\$\{formatId\}|%7BformatId%7D/.test(src),
          `expected a resolved image URL, got: ${src}`
        );
      });
    });

    it('strips embedded tweets', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      assert.strictEqual($('blockquote.tweet.embed').length, 0);
    });
  });
});
