import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('EconomictimesIndiatimesComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://economictimes.indiatimes.com/news/india/india-hosts-irans-khameneis-confidant-to-convey-position-on-kashmir-and-counter-criticism/articleshow/118667138.cms';
      const html = fs.readFileSync(
        './fixtures/economictimes.indiatimes.com/1740947974502.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(
        title,
        `India hosts Iran's Khamenei's confidant to convey position on Kashmir and counter criticism`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `Dipanjan Roy Chaudhury`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, null);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://img.etimg.com/thumb/msid-118667158,width-1200,height-630,imgsize-46468,overlay-economictimes/articleshow.jpg`
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
        `Iran's Supreme Leader Ayatollah Ali KhameneiIndia hosted the secretary of Iran's Supreme Council`
      );
    });
  });
});
