import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('OrfAtExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url = 'https://orf.at/stories/3409547/';
      const html = fs.readFileSync(
        './fixtures/orf.at/1762108926494.html',
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
        `Pilnacek-U-Ausschuss: Debatte über Liveübertragung neu entfacht`
      );
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      // ISO date-only "2025-10-25" parsed as midnight UTC
      assert.strictEqual(date_published, '2025-10-25T00:00:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://ibs.orf.at/news?image=https%3A%2F%2Fassets.orf.at%2Fmims%2F2025%2F43%2F41%2Fcrops%2Fw%3D1200%2Ch%3D630%2Cq%3D75%2F2812373_master_1085341_u_ausschuss_uebertragungen_debatte_luk.jpg%3Fs%3D8fe00bea37ad656987b778e7f3e5a5f6721340ff`
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
        'ORF/Lukas Krummholz Im Jänner sollen die Befragungen im Untersuchungsausschuss zur Causa Pilnacek starten.'
      );
    });
  });
});
