import assert from 'assert';
import URL from 'url';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('TldrTechExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url = 'https://tldr.tech/tech/2025-01-31';
      const html = fs.readFileSync(
        './fixtures/tldr.tech/1738465920389.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);

      assert.strictEqual(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(title, `TLDR 2025-01-31`);
    });
    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(lead_image_url, `https://tldr.tech/logo-jpg.jpg`);
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
        'OpenAI eyes $340B valuation 💰, Gemini 2.0 🤖, Javascript Temporal 👨‍💻AI Coding Agents'
      );
    });
  });
});
