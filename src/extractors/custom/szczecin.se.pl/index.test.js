import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('SzczecinSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://szczecin.se.pl/czterdziesci-wysokich-wygranych-w-eurojackpot-w-polsce-ale-to-w-tym-kraju-rozbili-wielka-kumulacje-aa-Vtns-Mgcv-RZmj.html';
      const html = fs.readFileSync(
        './fixtures/szczecin.se.pl/1739329179505.html'
      );
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
        `40 wysokich wygranych w Eurojackpot w Polsce. Ale to w tym kraju rozbili bank`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, 'Grzegorz Kluczyński');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, '2025-02-11T21:14:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-gXFW-ycoc-gAtS_czterdziesci-wysokich-wygranych-w-eurojackpot-w-polsce-ale-to-w-tym-kraju-rozbili-wielka-kumulacje-1280x960.jpg`
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
        'Czterdzieści wysokich wygranych w Eurojackpot w Polsce. Ale to w tym kraju rozbili'
      );
    });
  });
});
