import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwDigitalfoundryNetExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.digitalfoundry.net/features/world-of-warcraft-forever-brings-the-largest-visual-leap-in-the-mmos-history';
      const html = fs.readFileSync(
        './fixtures/www.digitalfoundry.net/1790467953854.html'
      );
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
        `World of Warcraft: Forever Brings the Largest Visual Leap in the MMO's History`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `William Judd`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-09-24T14:00:00.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://images.digitalfoundry.net/e715676d16aca/large.jpg`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'World of Warcraft: Forever is in beta now - and Oliver Mackenzie is'
      );
    });

    it('keeps the lazy-loaded YouTube embed', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      assert.strictEqual(
        $('iframe').attr('src'),
        'https://www.youtube.com/embed/hNkvZN2Cn80?rel=0&hd=1&showinfo=0&modestbranding=0&autohide=1'
      );
    });
  });
});
