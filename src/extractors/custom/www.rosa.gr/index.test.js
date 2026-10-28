import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwRosaGrExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.rosa.gr/athlitismos/cheimerinoi-olybiakoi-i-doe-apekleise-ton-oukrano-athliti-pou-forese-kranos-me-ta-thymata-tou-polemou/';
      const html = fs.readFileSync('./fixtures/www.rosa.gr/1792592560000.html');
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
        `Χειμερινοί Ολυμπιακοί: Η ΔΟΕ απέκλεισε τον Ουκρανό αθλητή που φόρεσε κράνος με τα θύματα του πολέμου`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Ιωάννα Καρδούλια`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-02-12T12:12:00.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://www.rosa.gr/wp-content/uploads/2026/02/ukraine-athlitis.jpg`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('.post-text').first().text(), 13);

      assert.strictEqual(
        first13,
        `Αποκλείστηκε με απόφαση της ΔΟΕ από τους Χειμερινούς Ολυμπιακούς ο αθλητής που φόρεσε`
      );
    });

    it('keeps the hero image as a figure ahead of the body', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');
      const $figure = $('figure');

      assert.strictEqual($figure.length, 1);
      assert.strictEqual(
        $figure.children('img').attr('src'),
        'https://www.rosa.gr/wp-content/uploads/2026/02/ukraine-athlitis.jpg'
      );
      assert.ok($figure.next().is('.post-text'));
    });

    it('drops a bare credit label', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      assert.strictEqual($('figcaption, .image-credits').length, 0);
    });

    it('keeps a real credit as the figure caption', async () => {
      const html = fs
        .readFileSync('./fixtures/www.rosa.gr/1792592560000.html', 'utf-8')
        .replace(
          '<span class="image-credits">X</span>',
          '<span class="image-credits">AP</span>'
        );
      const { content } = await Parser.parse(url, { html, fallback: false });

      const $ = cheerio.load(content || '');
      const captions = $('figure > figcaption')
        .map((_, el) => $(el).text())
        .get();

      assert.deepStrictEqual(captions, ['AP']);
    });

    it('cleans the read also block', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      assert.strictEqual($('.short-read-also').length, 0);
    });

    it('excludes the social icons', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      assert.strictEqual(
        $('svg, img[src*="rosa-theme/assets/images/"]').length,
        0
      );
    });
  });
});
