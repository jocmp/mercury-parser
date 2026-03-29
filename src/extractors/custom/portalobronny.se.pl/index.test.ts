import assert from 'assert';
import URL from 'url';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('PortalobronnySePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://portalobronny.se.pl/polityka-obronna/rosyjski-su-24-wlecial-na-6-5-km-w-przestrzen-powietrzna-polski-oficjalna-przyczyna-awaria-aa-ggzS-QUUG-sbdW.html';
      const html = fs.readFileSync(
        './fixtures/portalobronny.se.pl/1739330785415.html',
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
        `Rosyjski samolot wojskowy naruszył granicę Polski na 6,5 km. Służby zareagowały`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Juliusz Sabak');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-02-11T19:00:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-uqSS-Th99-6VHZ_su-24mr-rosja-1920x1080-nocrop.jpg`
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
        'Rosyjski samolot rozpoznawczy Su-24MR, który wykonywał lot z Obwodu Królewieckiego, „naruszył polską przestrzeń'
      );
    });
  });
});
