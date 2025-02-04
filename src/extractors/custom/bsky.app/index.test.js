import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('BskyAppExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://bsky.app/profile/guilhernunes.bsky.social/post/3lhco34pdss2j';
      const html = fs.readFileSync('./fixtures/bsky.app/1738632955411.html');
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.equal(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.equal(title, `guilherme nunes (@guilhernunes.bsky.social)`);
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, null);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, null);
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

      assert.equal(
        first13,
        'guilherme nunes guilhernunes.bsky.social did:plc:hew2gujvhhgtchs62pzzn7lb capybaras enjoying pizza pattern prints: https://www.inprnt.com/gallery/guilhernunes/capybaras-enjoying-pizza-pattern/ t-shirts and other'
      );
    });
  });
});
