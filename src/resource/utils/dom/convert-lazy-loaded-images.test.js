import assert from 'assert';
import * as cheerio from 'cheerio';

import convertLazyLoadedImages from './convert-lazy-loaded-images';

describe('convertLazyLoadedImages($)', () => {
  it('moves image links to src if placed in another attribute', () => {
    const $ = cheerio.load('<img data-src="http://example.com/foo.jpg">');
    const result = convertLazyLoadedImages($)('body').html();

    assert.strictEqual(
      result,
      '<img data-src="http://example.com/foo.jpg" src="http://example.com/foo.jpg">'
    );
  });

  it('moves image source candidates to srcset if placed in another attribute', () => {
    const $ = cheerio.load('<img data-srcset="http://example.com/foo.jpg 2x">');
    const result = convertLazyLoadedImages($)('body').html();

    assert.strictEqual(
      result,
      '<img data-srcset="http://example.com/foo.jpg 2x" srcset="http://example.com/foo.jpg 2x">'
    );
  });

  it('moves image source candidates containing query strings to srcset if placed in another attribute', () => {
    const $ = cheerio.load(
      '<img data-srcset="http://example.com/foo.jpg?w=400 2x, http://example.com/foo.jpg?w=600 3x">'
    );
    const result = convertLazyLoadedImages($)('body').html();

    assert.strictEqual(
      result,
      '<img data-srcset="http://example.com/foo.jpg?w=400 2x, http://example.com/foo.jpg?w=600 3x" srcset="http://example.com/foo.jpg?w=400 2x, http://example.com/foo.jpg?w=600 3x">'
    );
  });

  it('properly handles src and srcset attributes', () => {
    const $ = cheerio.load(
      '<img data-src="http://example.com/foo.jpg" data-srcset="http://example.com/foo.jpg 2x">'
    );
    const result = convertLazyLoadedImages($)('body').html();

    assert.strictEqual(
      result,
      '<img data-src="http://example.com/foo.jpg" data-srcset="http://example.com/foo.jpg 2x" src="http://example.com/foo.jpg" srcset="http://example.com/foo.jpg 2x">'
    );
  });

  it('does nothing when value is not a link', () => {
    // This is far from perfect, since a relative url could
    // be perfectly correct.
    const $ = cheerio.load('<img data-src="foo.jpg">');
    const result = convertLazyLoadedImages($)('body').html();

    assert.strictEqual(result, '<img data-src="foo.jpg">');
  });

  it('does nothing when value is not an image', () => {
    const $ = cheerio.load('<img data-src="http://example.com">');
    const result = convertLazyLoadedImages($)('body').html();

    assert.strictEqual(result, '<img data-src="http://example.com">');
  });

  it('does not change a correct img with src', () => {
    const $ = cheerio.load('<img src="http://example.com/foo.jpg">');
    const result = convertLazyLoadedImages($)('body').html();

    assert.strictEqual(result, '<img src="http://example.com/foo.jpg">');
  });

  it('does not replace an img src with srcset value', () => {
    const $ = cheerio.load(
      '<img src="http://example.com/foo.jpg" srcset="http://example.com/foo2x.jpg 2x, http://example.com/foo.jpg">'
    );
    const result = convertLazyLoadedImages($)('body').html();

    assert.strictEqual(
      result,
      '<img src="http://example.com/foo.jpg" srcset="http://example.com/foo2x.jpg 2x, http://example.com/foo.jpg">'
    );
  });

  // Guards against O(n^2) backtracking in IS_SRCSET: the image-url check runs on
  // every attribute of every <img>, so a long numeric query string must not hang.
  it('handles image URLs with long numeric query strings in linear time', () => {
    const value = `http://example.com/a.png?${'9'.repeat(50000)}`;
    const $ = cheerio.load(`<img data-src="${value}">`);

    const start = performance.now();
    convertLazyLoadedImages($);
    const elapsedMs = performance.now() - start;

    assert.ok(
      elapsedMs < 1000,
      `convertLazyLoadedImages took ${elapsedMs.toFixed(
        0
      )}ms; expected < 1000ms`
    );
  }, 20000);
});
