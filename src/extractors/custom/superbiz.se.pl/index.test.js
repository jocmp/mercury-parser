import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('SuperbizSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://superbiz.se.pl/wiadomosci/glodowe-podwyzki-dla-emerytow-wyplata-juz-w-marcu-aa-i6r8-YETS-C2h2.html';
      const html = fs.readFileSync(
        './fixtures/superbiz.se.pl/1739330496278.html'
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
        `Taką waloryzację emerytur seniorzy dostaną od Tuska! Oficjalny wskaźnik podwyżek`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Agnieszka Grotek`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-02-11T14:25:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-iVUH-Pb5n-dSAE_nowa-najnizsza-emerytura-w-2025-w-polsce-tyle-pieniedzy-otrzymaja-emeryci-po-waloryzacji-od-marca-1280x960.jpg`
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
        'Waloryzacja emerytur 2025 roku wyniesie 5,5 proc. Dla porównania w 2024 było to'
      );
    });
  });
});
