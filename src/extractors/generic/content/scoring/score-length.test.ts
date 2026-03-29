import assert from 'assert';

import { scoreLength } from './index';

describe('Scoring utils', () => {
  describe('scoreLength(textLength, tagName)', () => {
    it('returns 0 if length < 50 chars', () => {
      assert.strictEqual(scoreLength(30), 0);
    });

    it('returns varying scores but maxes out at 3', () => {
      assert.strictEqual(scoreLength(150), 1);
      assert.strictEqual(scoreLength(199), 1.98);
      assert.strictEqual(scoreLength(200), 2);
      assert.strictEqual(scoreLength(250), 3);
      assert.strictEqual(scoreLength(500), 3);
      assert.strictEqual(scoreLength(1500), 3);
    });
  });
});
