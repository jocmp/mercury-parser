import assert from 'assert';

import scoreLinkText from './score-link-text';

describe('scoreLinkText(linkText)', () => {
  it('returns 8 if link contains the num 2', () => {
    assert.strictEqual(scoreLinkText('2', 0), 8);
  });

  it('returns 5 if link contains the num 5', () => {
    assert.strictEqual(scoreLinkText('5', 0), 5);
  });

  it('returns -30 if link contains the number 1', () => {
    assert.strictEqual(scoreLinkText('1', 0), -30);
  });

  it('penalizes -50 if pageNum is >= link text as num', () => {
    assert.strictEqual(scoreLinkText('4', 5), -44);
  });
});
