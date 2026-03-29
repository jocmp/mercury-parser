import assert from 'assert';
import URL from 'url';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('LodzSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://lodz.se.pl/taksowkarz-otrzymal-8-ciosow-nozem-w-czasie-kursu-szokujacy-atak-w-lodzi-aa-XiRD-8S5M-JUVX.html';
      const html = fs.readFileSync(
        './fixtures/lodz.se.pl/1740021128676.html',
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

      assert.strictEqual(
        title,
        `Taksówkarz otrzymał 8 ciosów nożem w czasie kursu! Przerażający atak w Łodzi`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Michał Michalak`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-02-19T09:35:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.media.smcloud.net/t/videos/7B0FDAA62041416882CCEAC2A4216792_1-664x442.jpg`
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
        'Prokuratura poinformowała w piątek, 14 lutego, o zatrzymaniu mężczyzny, który usiłował zabić taksówkarza'
      );
    });
  });
});
