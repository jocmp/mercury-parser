import assert from 'assert';
import * as cheerio from 'cheerio';

import findWithin from './find-within';

describe('findWithin($context, selector)', () => {
  it('matches descendants for compound and comma-separated selectors', () => {
    const $ = cheerio.load(
      '<main class="context"><p class="note">One</p><section><img data-keep="yes"><p>Two</p></section></main>',
      null,
      false
    );
    const $context = $('main');
    const matches = findWithin($context, 'p.note, img[data-keep="yes"]');

    assert.deepStrictEqual(
      matches.toArray().map(node => node.tagName),
      ['p', 'img']
    );
  });

  it('does not include the context node for a wildcard selector', () => {
    const $ = cheerio.load(
      '<main class="context"><div><span>Text</span></div></main>',
      null,
      false
    );
    const $context = $('main');
    const matches = findWithin($context, '*');

    assert.strictEqual(matches.filter('.context').length, 0);
    assert.deepStrictEqual(
      matches.toArray().map(node => node.tagName),
      ['div', 'span']
    );
  });
});
