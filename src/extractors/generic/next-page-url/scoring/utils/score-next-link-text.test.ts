import assert from 'assert';

import scoreNextLinkText from './score-next-link-text';

describe('scoreNextLinkText(linkData)', () => {
  it('returns 50 if contains common next link text', () => {
    assert.strictEqual(scoreNextLinkText('foo bar Next page'), 50);
  });

  it('returns 0 if does not contain common next link text', () => {
    assert.strictEqual(scoreNextLinkText('foo bar WOW GREAT'), 0);
  });
});
