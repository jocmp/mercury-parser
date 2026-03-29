import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('Nineto5linuxComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://9to5linux.com/openvpn-2-7-released-with-support-for-dco-linux-kernel-module-mbedtls-4';
      const html =
        fs.readFileSync('./fixtures/9to5linux.com/1772404182459.html');
      result =
        Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname)
    })

    it('returns the title', async () => {
      const { title } = await result

      assert.strictEqual(title, `OpenVPN 2.7 Released with Support for DCO Linux Kernel Module, mbedTLS 4`)
    });

    it('returns the author', async () => {
      const { author } = await result

      assert.strictEqual(author, `Marcus Nestor`)
    });

    it('returns the date_published', async () => {
      const { date_published } = await result

      assert.strictEqual(date_published, `2026-02-11T13:39:31.000Z`)
    });

    it('returns the dek', async () => {
      const { dek } = await result

      assert.strictEqual(dek, null)
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result

      assert.strictEqual(lead_image_url, `https://9to5linux.com/wp-content/uploads/2025/11/ov.webp`)
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13)

      assert.strictEqual(first13, 'OpenVPN 2.7 has been released today as the latest version of this virtual');
    });
  });
});
