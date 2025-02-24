import assert from 'assert';

import { resolveSplitTitle } from './index';

describe('resolveSplitTitle(text)', () => {
  it('does nothing if title not splittable', () => {
    const title = 'This Is a Normal Title';

    assert.strictEqual(resolveSplitTitle(title), title);
  });

  it('extracts titles from breadcrumb-like titles', () => {
    const title = 'The Best Gadgets on Earth : Bits : Blogs : NYTimes.com';

    assert.strictEqual(resolveSplitTitle(title), 'The Best Gadgets on Earth ');
  });

  it('cleans domains from titles at the front', () => {
    const title = 'NYTimes - The Best Gadgets on Earth';
    const url = 'https://www.nytimes.com/bits/blog/etc/';

    assert.strictEqual(
      resolveSplitTitle(title, url),
      'The Best Gadgets on Earth'
    );
  });

  it('cleans domains from titles at the back', () => {
    const title = 'The Best Gadgets on Earth | NYTimes';
    const url = 'https://www.nytimes.com/bits/blog/etc/';

    assert.strictEqual(
      resolveSplitTitle(title, url),
      'The Best Gadgets on Earth'
    );
  });
});
