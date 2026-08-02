import assert from 'assert';
import * as cheerio from 'cheerio';

import { normalizeSpaces } from './index';

describe('normalizeSpaces(text)', () => {
  it('normalizes spaces from text', () => {
    const $ = cheerio.load(`
      <div>
        <p>What do you think?</p>
      </div>
    `);

    const result = normalizeSpaces($('*').first().text());
    assert.strictEqual(result, 'What do you think?');
  });

  it('preserves spaces in preformatted text blocks', () => {
    const $ = cheerio.load(
      `
      <div>
        <p>What   do  you    think?</p>
        <pre>  What     happens to        spaces?    </pre>
      </div>
    `,
      null,
      false
    );

    const result = normalizeSpaces($.html());
    assert.strictEqual(
      result,
      '<div> <p>What do you think?</p> <pre>  What     happens to        spaces?    </pre> </div>'
    );
  });

  // Guards against O(n^2) whitespace collapsing: a negative lookahead used to
  // re-scan to end-of-string at every whitespace run on tag-free text.
  it('normalizes large tag-free text in linear time', () => {
    // ~350KB of tag-free, whitespace-heavy text, like a big article's .text().
    const text = 'lorem ipsum dolor  sit amet  '.repeat(12000);

    const start = performance.now();
    const result = normalizeSpaces(text);
    const elapsedMs = performance.now() - start;

    assert.strictEqual(result.includes('  '), false);
    assert.ok(
      elapsedMs < 1000,
      `normalizeSpaces took ${elapsedMs.toFixed(0)}ms on ${
        text.length
      } chars; expected < 1000ms`
    );
  }, 20000);

  // cheerio never emits unclosed tags, but staying linear on malformed input
  // keeps this from becoming a CPU sink in a long-running process.
  it('stays linear on malformed input with many unclosed preserve tags', () => {
    const text = '<pre>  x  '.repeat(60000); // ~600KB, no closing tags

    const start = performance.now();
    normalizeSpaces(text);
    const elapsedMs = performance.now() - start;

    assert.ok(
      elapsedMs < 1000,
      `normalizeSpaces took ${elapsedMs.toFixed(
        0
      )}ms on malformed input; expected < 1000ms`
    );
  }, 20000);
});
