import assert from 'assert';

import isBrowser from 'utils/is-browser';
import getEncoding from './get-encoding';

// Tests are bypassed in the browser because it has an encoding
// A shim is used /src/shims/iconv-lite.js to decrease load size

describe('getEncoding(str)', () => {
  if (isBrowser) return;

  it('returns the encoding as a string', () => {
    const contentType = 'text/html; charset=iso-8859-15';
    assert.strictEqual(getEncoding(contentType), 'iso-8859-15');
  });

  it('returns utf-8 as a default if no encoding found', () => {
    const contentType = 'text/html';
    assert.strictEqual(getEncoding(contentType), 'utf-8');
  });

  it('returns utf-8 if there is an invalid encoding', () => {
    const contentType = 'text/html; charset=fake-charset';
    assert.strictEqual(getEncoding(contentType), 'utf-8');
  });
});
