import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Mercury from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('MaTtiasBeExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url = 'https://ma.ttias.be/cronweekly/issue-130/';
      const html = fs.readFileSync('./fixtures/ma.ttias.be.html');
      result = Mercury.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      // This test should be passing by default.
      // It sanity checks that the correct parser
      // is being selected for URLs from this domain
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      // To pass this test, fill out the title selector
      // in ./src/extractors/custom/ma.ttias.be/index.js.
      const { title } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        title,
        `cron.weekly issue #130: Github, keycloak, proc, redis6, cron & more`
      );
    });

    it('returns the author', async () => {
      // To pass this test, fill out the author selector
      // in ./src/extractors/custom/ma.ttias.be/index.js.
      const { author } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(author, 'Mattias Geniar');
    });

    it('returns the date_published', async () => {
      // To pass this test, fill out the date_published selector
      // in ./src/extractors/custom/ma.ttias.be/index.js.
      const { date_published } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(date_published, `2020-04-19T05:50:00.000Z`);
    });

    it('returns the dek', async () => {
      // To pass this test, fill out the dek selector
      // in ./src/extractors/custom/ma.ttias.be/index.js.
      const { dek } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(dek, null);
    });

    it('returns the lead_image_url', async () => {
      // To pass this test, fill out the lead_image_url selector
      // in ./src/extractors/custom/ma.ttias.be/index.js.
      const { lead_image_url } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(lead_image_url, null);
    });

    it('returns the content', async () => {
      const html = fs.readFileSync('./fixtures/ma.ttias.be.html');
      const uri = 'https://ma.ttias.be/cronweekly/issue-130/';

      const { content } = await Mercury.parse(uri, { html });

      const $ = cheerio.load(content || '');

      // Ensure that there are 3 h2 elements.
      const h2 = $('h2');

      assert.strictEqual(h2.length, 3);

      // Ensure that there are h2 h2 elements.
      const h3 = $('h3');

      assert.strictEqual(h3.length, 27);

      // Ensure that there is 1 ul element.
      const ul = $('ul');

      assert.strictEqual(ul.length, 1);

      // Ensure that there are no nav elements.
      const nav = $('nav');

      assert.strictEqual(nav.length, 0);

      // Check the first 13 words.

      const first13 = excerptContent(
        $('*')
          .first()
          .text(),
        13
      );

      assert.strictEqual(
        first13,
        'Hi everyone! 👋 Welcome to cron.weekly issue #130. There’s quite a bit of'
      );
    });
  });
});
