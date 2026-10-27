import assert from 'assert';
import * as cheerio from 'cheerio';

import Mercury from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwNprOrgExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'http://www.npr.org/sections/thetwo-way/2016/12/15/505723552/jury-finds-dylann-roof-guilty-in-s-c-church-shooting';
      const html = fs.readFileSync('./fixtures/www.npr.org.html', 'utf-8');
      result = Mercury.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(
        title,
        'Jury Finds Dylann Roof Guilty In S.C. Church Shooting'
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Rebecca Hersher');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, '2016-12-15T20:33:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        'https://media.npr.org/assets/img/2016/12/15/ap_16342669033405_wide-e76ba54ba052acbbbe4b9bd73bd429e8d5ca58c7.jpg?s=1400'
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'Dylann Roof is escorted from the Shelby Police Department in Shelby, N.C., on'
      );
    });
  });

  describe('Brightspot image templates', () => {
    it('expands template tokens in image sources', async () => {
      const url =
        'https://www.npr.org/2026/10/26/nx-s1-6008167/republican-redistricting-midterms-competitive-map';
      const html = fs.readFileSync(
        './fixtures/www.npr.org/1793044268000.html',
        'utf-8'
      );
      const { content } = await Mercury.parse(url, { html, fallback: false });

      assert.doesNotMatch(content, /\{\w+\}|%7B\w+%7D/i);
      assert.match(
        content,
        /\/resize\/1200\/quality\/85\/format\/webp\/\?url=http%3A%2F%2Fnpr-brightspot\.s3\.amazonaws\.com%2F06%2F6a%2F46ec36764e5db11da70604db9122%2Fgettyimages-2301229190\.jpg/
      );
    });

    it('expands template tokens in query strings', async () => {
      const url = 'https://www.npr.org/2026/10/26/nx-s1-0000000/example';
      const html = `
        <html><body><div class="storytext">
          <p>${'Story text that gives the extractor something to keep. '.repeat(10)}</p>
          <img
            src="https://media.npr.org/assets/img/x.jpg?s=100"
            data-template="https://media.npr.org/assets/img/x.jpg?s={width}&c={quality}&f={format}"
            data-format="jpeg"
          />
        </div></body></html>
      `;
      const { content } = await Mercury.parse(url, { html, fallback: false });

      assert.doesNotMatch(content, /\{\w+\}|%7B\w+%7D/i);
      assert.match(content, /x\.jpg\?s=1200&amp;c=85&amp;f=jpeg/);
    });
  });
});
