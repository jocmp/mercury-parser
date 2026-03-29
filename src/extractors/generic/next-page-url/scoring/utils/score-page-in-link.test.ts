import assert from 'assert';
import scorePageInLink from './score-page-in-link';

describe('scorePageInLink(pageNum, isWp)', () => {
  it('returns 50 if link contains a page num', () => {
    assert.strictEqual(scorePageInLink(1, false), 50);
  });

  it('returns 0 if link contains no page num', () => {
    assert.strictEqual(scorePageInLink(null, false), 0);
  });

  it('returns 0 if page is wordpress', () => {
    assert.strictEqual(scorePageInLink(10, true), 0);
  });
});
