import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwVersantsComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.versants.com/actualite/la-centrale-de-benevoles-doperation-nez-rouge-est-a-sainte-julie/';
      const html = fs.readFileSync(
        './fixtures/www.versants.com/1733366115610.html'
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
        `La centrale de bénévoles d'Opération Nez-Rouge est à Sainte-Julie`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, 'Frank Rodi');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, `2024-11-29T19:30:07.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://www.versants.com/wp-content/uploads/2024/11/4d8625da46376019625da4637b4962v_.jpg`
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
        "C'est à Sainte-Julie que les bénévoles de l'ONR VDR se retrouveront dès le"
      );
    });
  });
});
