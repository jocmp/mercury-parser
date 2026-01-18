import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwNotebookcheckNetExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.notebookcheck.net/8BitDo-64-Controller-now-available-to-pre-order-on-Amazon-in-Black-and-White-with-a-July-30-release-date.1054098.0.html';
      const html = fs.readFileSync(
        './fixtures/www.notebookcheck.net/1752012461747.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(
        title,
        `8BitDo 64 Controller now available to pre-order on Amazon in Black and White with a July 30 release date`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Habeeb Onawole');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-07-08T23:51:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc4/8BitDo-64-Controller.jpg`
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
        `The 8BitDo 64 Controller keeps some of the features of the original Nintendo`
      );
    });
  });
});
