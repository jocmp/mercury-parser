import assert from 'assert';
import * as cheerio from 'cheerio';

import clean from './clean';

describe('clean($)', () => {
  it('removes script elements', () => {
    const html = "<div><script>alert('hi')</script></div>";
    const $ = cheerio.load(html);

    assert.strictEqual(clean($)('body').html(), '<div></div>');
  });

  it('removes style elements', () => {
    const html = '<div><style>foo: {color: red;}</style></div>';
    const $ = cheerio.load(html);

    assert.strictEqual(clean($)('body').html(), '<div></div>');
  });

  it('removes comments', () => {
    const html = '<div>HI <!-- This is a comment --></div>';
    const $ = cheerio.load(html);

    assert.strictEqual(clean($)('body').html(), '<div>HI </div>');
  });

  it('removes nested comments without querying every descendant', () => {
    const $ = cheerio.load(
      '<div>before<!-- outer --><span>middle<!-- inner --></span>after</div>',
      null,
      false
    );
    const $root = $.root();
    $root.find = () => {
      throw new Error('cleanComments must not query all descendants');
    };
    $.root = () => $root;

    assert.strictEqual(
      clean($).html(),
      '<div>before<span>middle</span>after</div>'
    );
  });

  // More siblings than a spread call can pass as arguments.
  it('removes comments from a high-fan-out tree', () => {
    const comments = '<!-- comment -->'.repeat(130000);
    const $ = cheerio.load(`<div>before${comments}after</div>`, null, false);

    assert.strictEqual(clean($).html(), '<div>beforeafter</div>');
  });
});
