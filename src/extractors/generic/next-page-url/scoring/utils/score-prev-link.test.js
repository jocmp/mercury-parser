import assert from 'assert';

import scorePrevLink from './score-prev-link';

describe('scorePrevLink(linkData)', () => {
  it('returns -200 if link matches previous text', () => {
    assert.strictEqual(scorePrevLink('foo next previous page'), -200);
  });

  it('returns 0 if does not match a prev link', () => {
    assert.strictEqual(scorePrevLink('foo bar WOW GREAT'), 0);
  });
});
