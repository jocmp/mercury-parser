import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwJournaldelagenceComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.journaldelagence.com/1414206-stephane-plaza-immobilier-les-ambitions-de-wif-group-pour-relancer-le-reseau';
      const html = fs.readFileSync(
        './fixtures/www.journaldelagence.com/1792034490155.html'
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
        `Stéphane Plaza Immobilier : les ambitions de WIF Group pour relancer le réseau`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, null);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-10-14T12:45:09.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://media.journaldelagence.com/wp-content/uploads/2026/10/WIF-Group-1024x577.png`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        `C’est une nouvelle étape pour Stéphane Plaza Immobilier. Désormais intégré à WIF Group`
      );
    });
  });
});
