import assert from 'assert';
import * as cheerio from 'cheerio';

import scoreLinks from './score-links';

const fs = require('fs');

describe('scoreLinks(links)', () => {
  it('returns an object of scored links', () => {
    const html = fs.readFileSync('./fixtures/arstechnica.com.html', 'utf-8');
    const $ = cheerio.load(html);
    const links = $('a[href]').toArray();
    const url =
      'http://arstechnica.com/gadgets/2016/08/the-connected-renter-how-to-make-your-apartment-smarter/';

    const scoredPages = scoreLinks({
      links,
      articleUrl: url,
      baseUrl: 'http://arstechnica.com',
      $,
    });

    assert.strictEqual(typeof scoredPages, 'object');
  });

  it('returns null if no possible pages', () => {
    const $ = cheerio.load('<div><p>Hello wow</p></div>');
    const links = $('a[href]').toArray();
    const url =
      'http://arstechnica.com/gadgets/2016/08/the-connected-renter-how-to-make-your-apartment-smarter/';

    const scoredPages = scoreLinks({
      links,
      articleUrl: url,
      baseUrl: 'http://arstechnica.com',
      $,
    });

    assert.strictEqual(scoredPages, null);
  });
});
