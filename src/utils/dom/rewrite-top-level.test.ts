import * as cheerio from 'cheerio';
import assert from 'assert';

import { assertClean } from 'test-helpers';
import isBrowser from 'utils/is-browser';

import rewriteTopLevel from './rewrite-top-level';

describe('rewriteTopLevel(node, $)', () => {
  it('turns html and body tags into divs', () => {
    // Use document mode for this test since it explicitly tests html/body rewriting
    const $ = cheerio.load(`
        <html><body><div><p><a href="">Wow how about that</a></p></div></body></html>
    `);
    const result = rewriteTopLevel($('html').first(), $);

    assert.strictEqual(result('html').length, 0);
    assert.strictEqual(result('body').length, 0);

    if (!isBrowser) {
      // Cheerio 1.x outputs href="" and produces 2 divs (html->div, body->div)
      assertClean(
        result.html(),
        `
        <div><div><p><a href="">Wow how about that</a></p></div> </div>
      `
      );
    }
  });
});
