import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('TerminaltroveComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url = 'https://terminaltrove.com/jolt/';
      const html = fs.readFileSync(
        './fixtures/terminaltrove.com/1769047841159.html'
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
        `jolt - A beautiful TUI battery and energy monitor for your terminal.`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;
      assert.strictEqual(author, null);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, null);
    });

    it('returns the dek', async () => {
      const { dek } = await result;
      assert.strictEqual(
        dek,
        'A beautiful TUI battery and energy monitor for your terminal.'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;
      assert.strictEqual(
        lead_image_url,
        'https://cdn.terminaltrove.com/m/d6d77c6a-3e41-423e-8663-4196a8dc41e7.png'
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'A beautiful TUI battery and energy monitor for your terminal.jolt is a TUI'
      );
    });
  });
});
