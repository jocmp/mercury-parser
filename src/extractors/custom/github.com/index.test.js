import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('GithubComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://github.com/duyfken/alternative-front-ends/commit/3ba7a509ab42895d8158d71c64281b8013aceb2b';
      const html = fs.readFileSync('./fixtures/github.com/1736974487424.html');
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
        `Added LinkSheet to Tools Section + note to UntrackMe (no update since… · duyfken/alternative-front-ends@3ba7a50`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, `duyfken`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, `2024-11-27T13:50:57.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://opengraph.githubassets.com/4aa233b7153ff88367b3f4a56c3478fb511f37c916c45fde2c57ed6f7e9e0fa5/duyfken/alternative-front-ends/commit/3ba7a509ab42895d8158d71c64281b8013aceb2b`
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
        'Added LinkSheet to Tools Section + note to UntrackMe (no update since 2022,'
      );
    });
  });
});
