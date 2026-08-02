import assert from 'assert';
import * as cheerio from 'cheerio';

import { cleanTitle } from './index';

describe('cleanTitle(title, { url, $ })', () => {
  it('only uses h1 if there is only one on the page', () => {
    const title = 'Too Short';
    const $ = cheerio.load(`
      <div>
        <h1>This Is the Real Title</h1>
        <h1>This Is the Real Title</h1>
      </div>
    `);

    assert.strictEqual(cleanTitle(title, { url: '', $ }), title);
  });

  it('removes HTML tags from titles', () => {
    const $ = cheerio.load(
      '<div><h1>This Is the <em>Real</em> Title</h1></div>'
    );
    const title = $('h1').html();

    assert.strictEqual(
      cleanTitle(title, { url: '', $ }),
      'This Is the Real Title'
    );
  });

  it('trims extraneous spaces', () => {
    const title = " This Is a Great Title That You'll Love ";
    const $ = cheerio.load(
      '<div><h1>This Is the <em>Real</em> Title</h1></div>'
    );

    assert.strictEqual(cleanTitle(title, { url: '', $ }), title.trim());
  });

  // Guards against a stateful-regex bug: TITLE_SPLITTERS_RE was global (/g), so
  // TITLE_SPLITTERS_RE.test() advanced lastIndex between parses and made title
  // cleaning non-deterministic across successive calls.
  it('cleans a splittable title deterministically across repeated calls', () => {
    const title = 'The Best Gadgets on Earth : Bits : Blogs : NYTimes.com';
    const $ = cheerio.load('<div><h1>x</h1></div>');

    const results = new Set();
    for (let i = 0; i < 8; i += 1) {
      results.add(cleanTitle(title, { url: 'https://www.nytimes.com/', $ }));
    }

    assert.strictEqual(
      results.size,
      1,
      `cleanTitle was non-deterministic across calls: ${[...results]
        .map(r => JSON.stringify(r))
        .join(' vs ')}`
    );
  });
});
