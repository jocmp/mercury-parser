import assert from 'assert';
import * as cheerio from 'cheerio';

import extractBestNode from 'extractors/generic/content/extract-best-node';
import extractCleanNode from './content';

const fs = require('fs');

describe('extractCleanNode(article, { $, cleanConditionally, title } })', () => {
  it('cleans cruft out of a DOM node', () => {
    const html = fs.readFileSync(
      './fixtures/www.wired.com--content-test.html',
      'utf-8'
    );
    const $ = cheerio.load(html);

    const opts = {
      stripUnlikelyCandidates: true,
      weightNodes: true,
      cleanConditionally: true,
    };

    const bestNode = extractBestNode($, opts);

    const cleanNode = extractCleanNode(bestNode, { $, opts });

    const text = $(cleanNode)
      .text()
      .replace(/\n/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    assert.strictEqual(text.length === 2656 || text.length === 2657, true);
  });

  // Cheerio calls `.children()` to build the search roots for a selector that
  // isn't `:scope`-prefixed, then deduplicates them quadratically. Failing the
  // test on a wide `.children()` result detects an unscoped descendant search
  // without depending on wall-clock timing.
  it('does not pass a wide sibling list to selector context preparation', () => {
    const html = `<article>${'<p>article words remain here</p>'.repeat(
      2000
    )}</article>`;
    const $ = cheerio.load(html, null, false);
    const $article = $('article');
    const children = $article.children.bind($article);
    $article.children = (...args) => {
      const result = children(...args);
      if (result.length > 1) {
        throw new Error(
          `unscoped wide context contained ${result.length} children`
        );
      }
      return result;
    };

    extractCleanNode($article, {
      $,
      cleanConditionally: false,
      title: '',
      url: 'https://example.com/article',
    });

    assert.strictEqual($article.get(0).children.length, 2000);
  });
});
