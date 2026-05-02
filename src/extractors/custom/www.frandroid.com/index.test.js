import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwFrandroidComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.frandroid.com/marques/nakamura/3084049_test-nakamura-crosscity-la-meilleure-affaire-du-moment-pour-transporter-vos-enfants-a-velo-cargo-electrique';
      const html = fs.readFileSync(
        './fixtures/www.frandroid.com/1777688498862.html'
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
        `La nouvelle pépite d’Intersport : on a roulé avec ce vélo cargo compact à moins de 2200 €`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Matthieu Lauraux');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-05-01T16:02:11.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'Vélo cargo électrique compact et relativement léger, le Nakamura Crosscity+ n’a certes pas les capacités d’un longtail mais propose un bon équipement et un moteur central performant.'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://c0.lestechnophiles.com/images.frandroid.com/wp-content/uploads/2026/04/nakamura-crosscity-essai-velo-electrique-cargo.jpg?resize=1600,900&key=393ce73a&watermark`
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
        'Le vélo cargo électrique est un investissement non négligeable pour la petite famille.'
      );
    });
  });
});
