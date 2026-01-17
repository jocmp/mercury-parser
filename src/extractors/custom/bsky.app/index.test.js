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
      assert.strictEqual(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(title, `guilherme nunes (@guilhernunes.bsky.social)`);
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, null);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, null);
    });

    it('returns the lead_image_url', async () => {
      // Browser strips meta tags when parsed in body context
      if (cheerio.browser) return;

      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:hew2gujvhhgtchs62pzzn7lb/bafkreibejxm6dhz7e244nf57bqtur6ctmbtavus7yr3ghp5udzgderkhay@jpeg`
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
        'capybaras enjoying pizza pattern prints: https://www.inprnt.com/gallery/guilhernunes/capybaras-enjoying-pizza-pattern/ t-shirts and other products: https://www.redbubble.com/shop/ap/168320435?asc=u'
      );
    });
  });
});
