import assert from 'assert';
import * as cheerio from 'cheerio';

import { clean } from 'test-helpers';
import isBrowser from 'utils/is-browser';
import { paragraphize } from './index';

describe('Generic Extractor Utils', () => {
  describe('paragraphize(node)', () => {
    it('conversts a BR into P and moves inline contents to P tag after current parent', () => {
      const $ = cheerio.load(
        `
        <p>
          Here is some text
          <br />
          Here is more text
          <span>And also this</span>
        </p>
      `,
        null,
        false
      );
      const node = $('br').get(0);

      // note: result here is not valid html; will handle elsewhere
      const result = paragraphize(node, $, true).html();

      assert.strictEqual(
        clean(result),
        clean(`
          <p>
            Here is some text
          <p>
            Here is more text
            <span>And also this</span>
          </p></p>
        `)
      );
    });

    it('converts a BR into P and stops when block element hit', () => {
      const $ = cheerio.load(
        `
        <p>
          Here is some text
          <br />
          Here is more text
          <div>And also this</div>
        </p>
      `,
        null,
        false
      );
      const node = $('br').get(0);

      // note: result here is not valid html; will handle elsewhere
      const result = paragraphize(node, $, true).html();

      if (isBrowser) {
        // small quirks in how jquery handles this vs. cheerio
        const html =
          '<p> Here is some text <p> Here is more text </p></p><div>And also this</div> <p></p>';
        assert.strictEqual(clean(result), html);
      } else {
        // Cheerio 1.x produces slightly different output with extra empty <p></p>
        assert.strictEqual(
          clean(result),
          clean(`
            <p>
              Here is some text
            <p>
              Here is more text
            </p></p><div>And also this</div>
            <p></p>
          `)
        );
      }
    });
  });
});
