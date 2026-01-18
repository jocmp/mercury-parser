import assert from 'assert';
import * as cheerio from 'cheerio';

import isBrowser from 'utils/is-browser';
import normalizeMetaTags from './normalize-meta-tags';

describe('normalizeMetaTags($)', () => {
  it('replaces "content" attributes with "value"', () => {
    // browser cheerio/jquery will remove/replace html, so result is different
    const test = isBrowser
      ? '<meta name="foo" value="bar">'
      : '<html><head><meta name="foo" value="bar"></head><body></body></html>';

    const $ = cheerio.load('<html><meta name="foo" content="bar"></html>');
    const result = normalizeMetaTags($).html();

    assert.strictEqual(result, test);
  });

  it('replaces "property" attributes with "name"', () => {
    const test = isBrowser
      ? '<meta value="bar" name="foo">'
      : '<html><head><meta value="bar" name="foo"></head><body></body></html>';

    const $ = cheerio.load('<html><meta property="foo" value="bar"></html>');
    const result = normalizeMetaTags($).html();

    assert.strictEqual(result, test);
  });
});
