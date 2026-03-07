import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwMediaoneonlineComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.mediaoneonline.com/gulf/oman/low-pressure-set-to-bring-thunderstorms-across-oman-317411';
      const html =
        fs.readFileSync('./fixtures/www.mediaoneonline.com/1772907762395.html');
      result =
        Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(title, `തിങ്കളാഴ്ച മുതൽ ന്യൂനമർദ്ദം: ഒമാന്റെ ചില ഭാഗങ്ങളിൽ ഇടിമിന്നലോടുകൂടിയ മഴക്ക് സാധ്യത`);
    });

    it('returns the author', async () => {
      const { author } = await result;
      assert.strictEqual(author, `Web Desk`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, `2026-03-07T17:03:14.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;
      assert.strictEqual(dek, `മുസന്ദം, നോർത്ത് ബാത്തിന, സൗത്ത് ബാത്തിന, മസ്‌കത്ത് തുടങ്ങിയ ഇടങ്ങളിലൊക്കെ മഴ എത്തിയേക്കും`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;
      assert.strictEqual(lead_image_url, `https://www.mediaoneonline.com/h-upload/2026/01/24/1524788-.jpg`);
    });

    it('returns the content', async () => {
      const { content } = await result;
      const $ = cheerio.load(content || '');
      const first13 = excerptContent($('*').first().text(), 13);
      assert.strictEqual(first13, 'മസ്\u200Cകത്ത്: വരും ദിവസങ്ങളിൽ ഒമാന്റെ ചില ഭാഗങ്ങളിൽ അസ്ഥിര കാലാവസ്ഥയുണ്ടാകുമെന്ന് സിവിൽ ഏവിയേഷൻ അതോറിറ്റി (സിഎഎ). ന്യൂനമർദ്ദം');
    });
  });
});
