import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';

const fs = require('fs');

describe('WwwThevergeComExtractor', () => {
  describe('blog post', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.theverge.com/tech/895879/samsung-galaxy-z-trifold-discontinued-stock-sold-out';
      const html = fs.readFileSync(
        './fixtures/www.theverge.com/1773801618013.html',
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
        'Samsung discontinues its Galaxy Z TriFold after just three months'
      );
    });

    it('returns the author', async () => {
      const { author } = await result;
      assert.strictEqual(author, 'Jess Weatherbed');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, '2026-03-17T11:49:11.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;
      assert.ok(lead_image_url.includes('DSC02025_processed'));
    });

    it('returns the content', async () => {
      const { content } = await result;
      const $ = cheerio.load(content || '');
      assert.ok($('*').first().text().length > 100);
    });

    it('does not include follow-author', async () => {
      const { content } = await result;
      assert.ok(!content.includes('follow-author-article_footer'));
    });
  });

  describe('review with images', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.theverge.com/tech/894319/google-pixel-10a-review-screen-specs-battery-camera';
      const html = fs.readFileSync(
        './fixtures/www.theverge.com/1773801622700.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(title, 'Google Pixel 10A review: Just buy the 9A');
    });

    it('returns the author', async () => {
      const { author } = await result;
      assert.strictEqual(author, 'Dominic Preston');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, '2026-03-13T18:36:36.000Z');
    });

    it('retains images', async () => {
      const { content } = await result;
      const $ = cheerio.load(content || '');
      assert.ok($('img').length > 0, 'should have images in content');
    });

    it('does not include follow-author section', async () => {
      const { content } = await result;
      assert.ok(!content.includes('follow-author-article_footer'));
    });
  });

  describe('quick post with image', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.theverge.com/ai-artificial-intelligence/883034/openclaw-ai-deleting-emails-stop-openclaw';
      const html = fs.readFileSync(
        './fixtures/www.theverge.com/1773801624059.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(title, '\u201cSTOP OPENCLAW.\u201d');
    });

    it('returns the author', async () => {
      const { author } = await result;
      assert.strictEqual(author, 'Richard Lawler');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, '2026-02-23T20:14:27.000Z');
    });

    it('returns the content', async () => {
      const { content } = await result;
      assert.ok(content && content.length > 100);
    });

    it('does not include follow-author section', async () => {
      const { content } = await result;
      assert.ok(!content.includes('follow-author-article_footer'));
    });
  });

  describe('quick post with pull quote', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.theverge.com/games/882555/read-xbox-president-sarah-bonds-memo-about-leaving-microsoft';
      const html = fs.readFileSync(
        './fixtures/www.theverge.com/1773801624834.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(
        title,
        "Read Xbox president Sarah Bond\u2019s memo about leaving Microsoft."
      );
    });

    it('returns the author', async () => {
      const { author } = await result;
      assert.strictEqual(author, 'Richard Lawler');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, '2026-02-21T00:15:35.000Z');
    });

    it('retains blockquote', async () => {
      const { content } = await result;
      const $ = cheerio.load(content || '');
      assert.ok($('blockquote').length > 0, 'should have a blockquote');
    });

    it('does not include follow-author section', async () => {
      const { content } = await result;
      assert.ok(!content.includes('follow-author-article_footer'));
    });
  });
});
