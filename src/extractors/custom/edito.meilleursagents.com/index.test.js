import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('EditoMeilleursagentsComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://edito.meilleursagents.com/conseils-d-experts/vendre/dpe-logements-ont-change-de-classe-faire-de-travaux-article-23814.html';
      const html = fs.readFileSync(
        './fixtures/edito.meilleursagents.com/1792034517247.html'
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
        `DPE : ces logements qui ont changé de classe sans faire de travaux`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Stéphanie Marpinard`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-10-05T14:32:26.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://edito.meilleursagents.com/sites/default/files/styles/1200x673/public/images/web/2026-10/meilleur-dpe-sans-travaux-meilleurs-agents.jpg?itok=Syf_WRJi`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        `Votre logement est-il mieux classé qu’il y a quelques mois sans que vous`
      );
    });
  });
});
