import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwNtvDeExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.n-tv.de/regionales/hamburg-und-schleswig-holstein/Gespraeche-zum-Opernneubau-in-Hamburg-dauern-weiter-an-article25536027.html';
      const html = fs.readFileSync('./fixtures/www.n-tv.de/1738634255868.html');
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.equal(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.equal(
        title,
        `Gespräche zum Opernneubau in Hamburg dauern weiter an`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, null);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, `2025-02-03T15:38:07.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://www.n-tv.de/img/Bilder_dpa_Import/crop25536026/9581321679-cImg_16_9-w1200/Der-Baakenhoft-in-der-Hamburger-Hafencity.jpg`
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
        'Milliardär Klaus-Michael Kühne will seiner Heimatstadt eine Oper schenken. Das Gebäude soll architektonisch'
      );
    });
  });
});
