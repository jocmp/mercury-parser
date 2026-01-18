import assert from 'assert';
import * as cheerio from 'cheerio';

import normalizeMetaTags from './normalize-meta-tags';

describe('normalizeMetaTags($)', () => {
  it('replaces "content" attributes with "value"', () => {
    const expected =
      '<html><head><meta name="foo" value="bar"></head><body></body></html>';

    const $ = cheerio.load('<html><meta name="foo" content="bar"></html>');
    const result = normalizeMetaTags($).html();

    assert.strictEqual(result, expected);
  });

  it('replaces "property" attributes with "name"', () => {
    const expected =
      '<html><head><meta value="bar" name="foo"></head><body></body></html>';

    const $ = cheerio.load('<html><meta property="foo" value="bar"></html>');
    const result = normalizeMetaTags($).html();

    assert.strictEqual(result, expected);
  });
});
