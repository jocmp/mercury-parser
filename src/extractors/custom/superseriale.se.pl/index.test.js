import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('SuperserialeSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://superseriale.se.pl/barwy-szczescia/barwy-szczescia-odcinek-3122-rozmowa-miedzy-jozefina-a-cezarym-wyjasni-wszystko-nigdy-dotad-nie-byla-z-nim-tak-szczera-zdjecia-aa-1iTt-uHSL-6tRa.html';
      const html = fs.readFileSync(
        './fixtures/superseriale.se.pl/1738720194653.html'
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
        `Barwy szczęścia, odcinek 3122: Rozmowa między Józefiną a Cezarym wyjaśni wszystko. Nigdy dotąd nie była z nim tak szczera - ZDJĘCIA`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Anna Kilian');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-02-04T21:53:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-SpMP-Atg1-RJaU_barwy-szczescia-odcinek-3122-cezary-marcel-opalinski-jozefina-elzbieta-jarosik-1280x960.jpg`
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
        'W 3122. odcinku serialu "Barwy szczęścia" dojdzie do szczerej rozmowy między Józefiną (Elżbieta'
      );
    });
  });
});
