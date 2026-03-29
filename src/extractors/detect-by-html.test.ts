import assert from 'assert';
import * as cheerio from 'cheerio';

import detectByHtml from './detect-by-html';

describe('detectByHtml', () => {
  it('detects a medium post from the html', () => {
    const $ = cheerio.load(
      '<head><meta name="al:ios:app_name" value="Medium" /></head>'
    );

    assert.strictEqual(detectByHtml($).domain, 'medium.com');
  });

  it('returns nothing if no match is found', () => {
    const $ = cheerio.load('<div></div>');

    assert.strictEqual(detectByHtml($), undefined);
  });
});
