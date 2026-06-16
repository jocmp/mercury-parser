import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwAnimenewsnetworkComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.animenewsnetwork.com/news/2026-06-14/school-of-horns-mito-aoi-launches-new-manga/.238512';
      const html = fs.readFileSync(
        './fixtures/www.animenewsnetwork.com/1781536993736.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(title, `School of Horns' Mito Aoi Launches New Manga`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-06-15T15:15:00.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'Aoi, Meza Tōno launch Koko ni Fukuen Flag ga Tatteimasu manga'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://www.animenewsnetwork.com/thumbnails/crop600x315gIB/cms/news.9/238512/fukuenflag.jpg`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'Image via Comic Days X/Twitter accountManga creators Mito Aoi and Meza Tōno launched'
      );
    });

    it('resolves lazy-loaded images to real URLs', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');
      const images = $('img').toArray();

      assert.ok(images.length > 0, 'expected inline images in the content');
      assert.ok(
        !(content || '').includes('spacer.gif'),
        'expected no spacer.gif placeholders to remain'
      );

      images.forEach(img => {
        const src = $(img).attr('src') || '';
        assert.ok(
          /^https?:\/\//.test(src),
          `expected an absolute image URL, got: ${src}`
        );
      });
    });
  });
});
