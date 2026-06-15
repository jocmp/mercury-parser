import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwTweaktownComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.tweaktown.com/news/111097/anthropic-launches-claude-design-and-its-trying-to-work-with-canva-not-compete-with-it/index.html';
      const html = fs.readFileSync(
        './fixtures/www.tweaktown.com/1781467944005.html'
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
        `Anthropic launches Claude Design, and it's trying to work with Canva, not compete with it`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Hassam Nasir`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-04-17T20:08:04.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        "Anthropic isn't after a slice of the pie and wants users to enjoy the whole thing by exporting Claude Design projects to Canva and vice versa."
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://static.tweaktown.com/news/16x9/111097_anthropic-launches-claude-design.png`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        "Graphic designers and casual users are still figuring out Canva's new AI 2.0,"
      );
    });
  });
});
