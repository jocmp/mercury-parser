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
        'https://www.rosa.gr/kosmos/i-epomeni-mera-ston-livano-to-kyma-epistrofis-ton-ektopismenon-kai-i-varia-skia-tis-katastrofis/';
      const html = fs.readFileSync('./fixtures/www.rosa.gr/1781600000000.html');
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
        'Η επόμενη μέρα στον Λίβανο: Το κύμα επιστροφής των εκτοπισμένων και η βαριά σκιά της καταστροφής'
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Χρήστος Τζίφας');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2026-06-16T20:17:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        'https://www.rosa.gr/wp-content/uploads/2026/04/livanos_irsrail.jpg'
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'ΑΠΕ-ΜΠΕ/EPA Μια νέα, εξαιρετικά κρίσιμη σελίδα ανοίγει για τη Μέση Ανατολή μετά την'
      );
    });

    it('includes the hero image and drops the related/promo/ad/social widgets', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      assert.ok($('p').length > 0, 'expected article paragraphs');
      assert.strictEqual(
        $('img[src*="livanos_irsrail"]').length,
        1,
        'expected the hero article image to be included'
      );
      assert.strictEqual(
        $(
          '.short-read-also, .post-list, .widget-article, .ad-placement, .follow-link'
        ).length,
        0,
        'expected related-article, promo, ad, and social widgets to be removed'
      );
    });

    it('retains genuine section headings', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');
      const headings = $('h2')
        .toArray()
        .map(h => $(h).text().trim());

      assert.ok(
        headings.includes('Η σκληρή πραγματικότητα της εκεχειρίας'),
        'expected the article section heading to be kept'
      );
      assert.ok(
        !headings.includes('ΔΙΑΒΑΣΤΕ ΕΠΙΣΗΣ'),
        'expected the read-also widget heading to be dropped'
      );
    });
  });
});
