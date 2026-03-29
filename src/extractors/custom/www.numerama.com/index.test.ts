import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwNumeramaComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.numerama.com/tech/2050917-sam-altman-annonce-deja-des-changements-pour-chatgpt-5-apres-2-jours-dexistence.html';
      const html = fs.readFileSync(
        './fixtures/www.numerama.com/1768855515453.html'
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
        `2 jours après le lancement de ChatGPT-5, Sam Altman annonce déjà des changements : lesquels ?`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Nelly Lesage');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-08-09T08:00:29.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(dek, 'Quelques ajustements');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://c0.lestechnophiles.com/www.numerama.com/wp-content/uploads/2025/08/chatgpt-5.jpg?resize=1600,900&key=80a10d69&watermark`
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
        'ChatGPT-5 est disponible depuis le 6 août 2025. Quelques jours après son lancement,'
      );
    });
  });
});
