import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwEuronewsComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'http://www.euronews.com/culture/2026/03/24/chaos-connection-and-catastrophic-cringe-the-best-karaoke-scenes-in-movies';
      const html =
        fs.readFileSync('./fixtures/www.euronews.com/1774399076121.html');
      result =
        Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname)
    })

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(title, `Movie mic drops: The best karaoke scenes in cinema`);
    });

    it('returns the author', async () => {
      const { author } = await result;
      assert.strictEqual(author, 'Amber Louise Bryce');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, '2026-03-24T14:41:34.000Z');
    });

    it('returns the dek', async () => {
      const { dek } = await result;
      assert.strictEqual(
        dek,
        "As Sandra Hüller takes to the mic for a rendition of 'Sign of the Times' in sci-fi blockbuster 'Project Hail Mary,' Euronews Culture looks back at cinema's most memorable karaoke scenes."
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;
      assert.strictEqual(
        lead_image_url,
        'https://images.euronews.com/articles/stories/09/69/55/49/1200x675_cmsv2_9e9f1d26-cbbf-5ebe-8534-13de24e9e52e-9695549.jpg'
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        "Everyone has a go-to karaoke song, and for Sandra H\u00fcller, it\u2019s 'Sign of"
      );
    });
  });
});
