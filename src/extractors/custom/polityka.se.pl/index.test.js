import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('PolitykaSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://polityka.se.pl/wiadomosci/express-biedrzyckiej-goscie-we-wtorek-4-lutego-aa-HqkJ-vZBV-aJyE.html';
      const html = fs.readFileSync(
        './fixtures/polityka.se.pl/1738719320280.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.equal(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.equal(title, `Express Biedrzyckiej: goście we wtorek 4 lutego`);
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, `Paulina Jaworska`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, '2025-02-03T11:48:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-EgtX-K7KS-R5uR_kamila-biedrzycka-prowadzaca-express-biedrzyckiej-1920x1080-nocrop.jpg`
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
      assert.equal(
        first13,
        'Autor: SE Kamila Biedrzycka, prowadząca "Express Biedrzyckiej" We wtorek (4 lutego) w "Expressie'
      );
    });
  });
});
