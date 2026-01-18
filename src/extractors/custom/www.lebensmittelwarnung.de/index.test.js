import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwLebensmittelwarnungDeExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.lebensmittelwarnung.de/___lebensmittelwarnung.de/Meldungen/2025/02_Feb/250221_13_HE_DubaiSchokolade/250221_13_HE_DubaiSchokolade.html';
      const html = fs.readFileSync(
        './fixtures/www.lebensmittelwarnung.de/1740334572528.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(title, `Miskets Dubai Chocolate, 100 Gramm`);
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, null);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2025-02-20T23:00:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://www.lebensmittelwarnung.de/___lebensmittelwarnung.de/Meldungen/2025/02_Feb/250221_13_HE_DubaiSchokolade/250221_13_HE_DubaiSchokolade_Bild.jpg?__blob=normal&v=1`
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
        'Produktbezeichnung/ -beschreibung: Miskets Dubai Chocolate (Milchschokolade mit Crashy Kadayif und Pistachienfüllung (35 %)),'
      );
    });

    it('preserves h2 tags', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const h2 = $('h2')
        .first()
        .text();

      assert.strictEqual(h2, 'Was ist der Grund der Meldung?');
    });
  });
});
