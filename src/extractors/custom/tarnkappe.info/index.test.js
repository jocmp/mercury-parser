import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('TarnkappeInfoExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://tarnkappe.info/artikel/krypto/krypto-boerse-garantex-keine-geldwaesche-mehr-fuer-ganoven-311235.html';
      const html = fs.readFileSync(
        './fixtures/tarnkappe.info/1741834825985.html',
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
        `Krypto-Börse Garantex: Keine Geldwäsche mehr für Ganoven`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Sunny`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-03-07T06:25:18.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.tarnkappe.info/wpimg/krypto-boerse-garantex-keine-geldwaesche-mehr-fuer-ganoven`
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
        'Krypto-Börse Garantex geschlossenBildquelle: Screenshot Tarnkappe Garantex Shutdown! Die Krypto-Börse wurde wegen Geldwäsche für'
      );
    });
  });
});
