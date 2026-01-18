import assert from 'assert';

import Mercury from 'mercury';

const fs = require('fs');

describe('NYMagExtractor', () => {
  it('works with a feature story', async () => {
    const html = fs.readFileSync('./fixtures/nymag.com.html', 'utf-8');
    const uri =
      'http://nymag.com/daily/intelligencer/2016/09/how-fox-news-women-took-down-roger-ailes.html';

    const { title, author } = await Mercury.parse(uri, { html });

    // Note: dek extraction has a complex interaction with excerpt extraction
    // that causes it to return null in the full Mercury.parse pipeline
    assert.strictEqual(title, 'The Revenge of Roger’s Angels');
    assert.strictEqual(author, 'Gabriel Sherman');
  });
});
