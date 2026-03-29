import assert from 'assert';
import URL from 'url';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('BialystokSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://bialystok.se.pl/posuzkiwany-31-latek-na-widok-policjantow-wyskoczyl-z-okna-aa-saMz-guMy-DgNE.html';
      const html = fs.readFileSync(
        './fixtures/bialystok.se.pl/1740023079333.html',
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
        `Dramat na Podlasiu! Na widok policjantów wyskoczył z okna`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Jacek Chlewicki`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-02-17T11:01:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-Qi54-k7Ye-55qk_poszukiwany-31-latek-na-widok-policjantow-wyskoczyl-z-okna-1920x1080-nocrop.jpg`
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
        'Poszukiwany 31-latek na widok policjantów wyskoczył z okna Policjanci zatrzymali poszukiwanego 31-latka. Mężczyzna'
      );
    });
  });
});
