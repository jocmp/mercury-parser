import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwVideogameschronicleComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.videogameschronicle.com/news/super-mario-bros-wonder-is-getting-a-switch-2-edition-with-new-multiplayer-modes/';
      const html = fs.readFileSync(
        './fixtures/www.videogameschronicle.com/1768850586063.html'
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
        `Super Mario Bros Wonder is getting a Switch 2 Edition with new multiplayer modes | VGC`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Chris Scullion');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-09-12T13:19:29.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'Super Mario Bros Wonder: Nintendo Switch 2 Edition + Meetup in Bellabel Park is out next Spring…'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        'https://www.videogameschronicle.com/files/2025/09/super-mario-bros-wonder.jpg'
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
        'Nintendo has announced that a Switch 2 edition of Super Mario Bros Wonder'
      );
    });
  });
});
