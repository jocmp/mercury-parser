import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwJalopnikComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.jalopnik.com/2105422/car-brand-most-satisfying-to-drive-consumer-reports/';
      const html =
        fs.readFileSync('./fixtures/www.jalopnik.com/1771956757054.html');
      result =
        Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname)
    })

    it('returns the title', async () => {
      const { title } = await result
      assert.strictEqual(title, `This Is The Most Satisfying Car Brand To Drive, According To Consumer Reports' Rankings`)
    });

    it('returns the author', async () => {
      const { author } = await result
      assert.strictEqual(author, 'Charles Krome')
    });

    it('returns the date_published', async () => {
      const { date_published } = await result
      assert.strictEqual(date_published, `2026-02-21T02:25:00.000Z`)
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result
      assert.strictEqual(lead_image_url, `https://www.jalopnik.com/img/gallery/this-is-the-most-satisfying-car-brand-to-drive-according-to-consumer-reports-rankings/l-intro-1771623279.jpg`)
    });

    it('returns the dek', async () => {
      const { dek } = await result
      assert.strictEqual(dek, `Rivian is the most satisfying car brand to drive, according to drivers surveyed by Consumer Reports. CR's testing, though, shows lesser results.`)
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13)

      assert.strictEqual(first13, 'Rivian What makes a car satisfying to drive? It may seem a complicated,');
    });
  });
});
