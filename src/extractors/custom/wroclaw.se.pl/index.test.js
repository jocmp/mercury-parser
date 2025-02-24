import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WroclawSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://wroclaw.se.pl/policjanci-zawiezli-zatrzymanego-mezczyzne-do-sklepu-zaskakujac-cel-wizyty-aa-QhNb-WfPJ-587w.html';
      const html = fs.readFileSync(
        './fixtures/wroclaw.se.pl/1740022661473.html'
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
        `Policjanci zawieźli zatrzymanego mężczyznę do sklepu. Zaskakując cel wizyty`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Artur Szkudlarek`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-02-14T17:43:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-cxbM-risz-JRMu_policjanci-zawiezli-zatrzymanego-mezczyzne-do-sklepu-1920x1080-nocrop.jpg`
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
        'Niecodzienna interwencja policjantów z Oleśnicy. Zawieźli oni zatrzymanego mężczyznę do sklepu, dzięki czemu'
      );
    });
  });
});
