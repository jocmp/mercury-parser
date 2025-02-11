import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('ArstechnicaComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://arstechnica.com/science/2025/02/twenty-two-states-sue-to-block-new-nih-funding-policy/';
      const html = fs.readFileSync(
        './fixtures/arstechnica.com/1739238328741.html'
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
        `22 states sue to block new NIH funding policy—court puts it on hold`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, null);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, null);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://cdn.arstechnica.net/wp-content/uploads/2025/02/GettyImages-158649166-1152x648.jpg`
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
        'On Friday, the National Institutes of Health (NIH) announced a sudden change to'
      );
    });
  });
});
