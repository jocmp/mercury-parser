import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.se.pl/wiadomosci/exclusive/romuald-lipko-niezapomniane-melodie-wspomnienia-o-liderze-budki-suflera-aa-AeXW-yuX4-t87q.html';
      const html = fs.readFileSync('./fixtures/www.se.pl/1738717059225.html');
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
        `Romuald Lipko - TVP zabiera nas w czasy jego niezapomnianych melodii!`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, `Anna Kobryń`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, '2025-02-04T16:47:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-YZoe-jXwL-mtfR_romuald-lipko-1920x1080-nocrop.jpg`
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
        'Romuald Lipko, lider zespołu Budka Suflera we wspomnieniach najbliższej rodziny i przyjaciół. W'
      );
    });
  });
});
