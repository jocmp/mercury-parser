import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('PolskisamorzadSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://polskisamorzad.se.pl/artykul/910,rekordowy-styczen-lotniska-we-wroclawiu-wiadomo-dokad-najchetniej-podrozowali-pasazerowie';
      const html = fs.readFileSync(
        './fixtures/polskisamorzad.se.pl/1739330983902.html',
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
        `Rekordowy styczeń lotniska. Wiadomo, dokąd najchętniej podróżowali pasażerowie`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Sebastian Chrostowski');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, null);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://static2.polskisamorzad.pl/data/articles/xga-4x3-rekordowy-styczen-lotniska-we-wroclawiu-wiadomo-dokad-najchetniej-podrozowali-pasazerowie-1739257708.jpg`
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
        'W styczniu 2025 r. prawie 264 tys. pasażerów skorzystało z usług Portu Lotniczego'
      );
    });
  });
});
