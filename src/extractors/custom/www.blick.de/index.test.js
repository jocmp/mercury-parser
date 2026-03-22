import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwBlickDeExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.blick.de/erzgebirge/fachkraeftemangel-im-erzgebirge-arztpraxen-suchen-verzweifelt-nach-personal-artikel14183771';
      const html =
        fs.readFileSync('./fixtures/www.blick.de/1774199156467.html');
      result =
        Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname)
    })

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(title, 'Fachkräftemangel im Erzgebirge: Arztpraxen suchen verzweifelt nach Personal');
    });

    it('returns the author', async () => {
      const { author } = await result;
      assert.strictEqual(author, 'Jana Kretzschmann');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, '2026-03-22T10:46:00.000Z');
    });

    it('returns the dek', async () => {
      const { dek } = await result;
      assert.strictEqual(dek, 'Ohne Bewerber drohen Einschränkungen im Praxisbetrieb');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;
      assert.strictEqual(lead_image_url, 'https://www.blick.de/DYNIMG/fachkraeftemangel-im-erzgebirge-arztpraxen-suchen-verzweifelt-nach-personal/Zj8nFZ0BFsCl-pjZYbu5/57/11/18385711_W2040C2040x1360o0x0.jpg');
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(first13, 'Dr. med. Hans-Hendrik Knäbchen eröffnete seine Praxis 1998. Noch nie zuvor gab es');
    });
  });
});
