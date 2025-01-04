import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwHardwarezoneComSgExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.hardwarezone.com.sg/feature-how-spot-potential-scam-messages-ios-and-android-singapore-rcs-sms';
      const html = fs.readFileSync(
        './fixtures/www.hardwarezone.com.sg/1736024727516.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.equal(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.equal(
        title,
        `How to spot potential scam messages on iOS and Android`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, 'Team HardwareZone');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, '2024-12-21T00:00:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://www.hardwarezone.com.sg/thumbs/714207/og.jpg?b3c6`
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

      assert.equal(
        first13,
        'This article is contributed by Carmen Sin, and a version of it first'
      );
    });
  });
});
