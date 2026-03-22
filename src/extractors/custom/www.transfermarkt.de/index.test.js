import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwTransfermarktDeExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.transfermarkt.de/wechselt-gladbach-youngster-mohya-den-verband-kontaktaufnahme-von-marokko/view/news/477021';
      const html =
        fs.readFileSync('./fixtures/www.transfermarkt.de/1774195839483.html');
      result =
        Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname)
    })

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(title, 'Wechselt Gladbach-Youngster Mohya den Verband? Kontaktaufnahme von Marokko');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, '2026-03-22T13:08:00.000Z');
    });

    it('returns the dek', async () => {
      const { dek } = await result;
      assert.strictEqual(dek, 'Der deutsche U18-Nationalspieler Wael Mohya von Borussia Mönchengladbach wird vom marokkanischen Verband umworben.');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;
      assert.strictEqual(lead_image_url, 'https://tmssl.akamaized.net/images/foto/big/wael-mohya-borussia-monchengladbach-2025-1761725052-181528.jpg?lm=1761725063');
    });

    it('returns the content', async () => {
      const { content } = await result;
      const $ = cheerio.load(content || '');
      const first13 = excerptContent($('*').first().text(), 13);
      assert.strictEqual(first13, 'Im WM-Countdown ziehen die nationalen Fußball-Verbände traditionell viele Register. Einer, der beim nachträglich');
    });
  });
});
