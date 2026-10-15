import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('ActualitesLogicImmoComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://actualites.logic-immo.com/conseils-d-experts/batterie-installation-solaire-article-23719.html';
      const html = fs.readFileSync(
        './fixtures/actualites.logic-immo.com/1792034508338.html'
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
        `Quelle batterie pour votre installation solaire ?`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Juliette Cadot`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-09-25T12:56:07.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://actualites.logic-immo.com/sites/default/files/styles/1200x673/public/images/web/2026-09/quelle-batterie-choisir-installation-solaire.jpg?itok=ekKDJ4Hc`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        `Vos panneaux solaires produisent de l'électricité en plein après-midi, mais vous en avez`
      );
    });
  });
});
