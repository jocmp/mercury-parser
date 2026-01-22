import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('IciRadioCanadaCaExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://ici.radio-canada.ca/nouvelle/2205360/budget-federal-depenses-compressions-investissements-deficit-2025';
      const html = fs.readFileSync(
        './fixtures/ici.radio-canada.ca/1769046155910.html'
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
        'Budget fédéral\u00a0: dépenses de taille, compressions humbles et un déficit qui se creuse'
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Zone Politique - ICI.Radio-Canada.ca');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-11-04T21:04:12.603Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        'https://images.radio-canada.ca/q_auto,w_1250/v1/ici-info/16x9/mark-carney-francois-philippe-champagne-budget-2025-un-canada-fort.jpg'
      );
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'Pour leur premier budget, les libéraux de Mark Carney misent sur des investissements considérables axés sur le logement, les infrastructures et la défense.'
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        '« Générationnels », « audacieux », « historiques »… Ce ne sont pas'
      );
    });
  });
});
