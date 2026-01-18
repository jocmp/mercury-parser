import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwFuturaSciencesComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.futura-sciences.com/maison/actualites/architecture-vous-cherchez-autre-chose-paris-rome-barcelone-ces-5-villes-vont-vous-retourner-esprit-122621/#xtor%3DRSS-8';
      const html = fs.readFileSync(
        './fixtures/www.futura-sciences.com/1752023361098.html',
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
        `Vous cherchez autre chose que Paris, Rome ou Barcelone ? Ces 5 villes vont vous retourner l’esprit`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Alexandra Arquey');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-06-20T11:06:37.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/d/9/5/d9535884a4_50231944_villes-europe-insolites.jpg`
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
        `Que vous soyez féru(e) d'architecture, gastronome curieux ou avide de vieilles pierres, les`
      );
    });
  });
});
