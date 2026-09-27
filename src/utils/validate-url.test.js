import assert from 'assert';

import parseUrl from './parse-url';
import validateUrl from './validate-url';

describe('validateUrl(parsedUrl)', () => {
  it('returns false if url is not valid', () => {
    const url = parseUrl('example.com');
    const valid = validateUrl(url);

    assert.strictEqual(valid, false);
  });

  it('returns true if url is valid', () => {
    const url = parseUrl('http://example.com');
    const valid = validateUrl(url);

    assert.strictEqual(valid, true);
  });
});
