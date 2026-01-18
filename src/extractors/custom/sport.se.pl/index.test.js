import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('SportSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://sport.se.pl/pilka-nozna/ekstraklasa/kolejna-katastrofa-slaska-ogromny-zawod-z-piastem-ale-co-zrobil-rafal-leszczynski-wideo-aa-orCp-ajk6-8ada.html';
      const html = fs.readFileSync(
        './fixtures/sport.se.pl/1738679563886.html',
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
        `Kolejne rozczarowanie dla Śląska. Piast go wypunktował. I jeszcze ten KOSZMARNY błąd Rafała Leszczyńskiego!`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Marcin Szczepański`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-02-03T20:02:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-rdUk-X5iW-9qQh_rafal-leszczynski-1920x1080-nocrop.jpg`
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
        'Rafał Leszczyński, bramkarz Śląska Wrocław Trener Ante Simundża podjął się misji ratowania Śląska.'
      );
    });
  });
});
