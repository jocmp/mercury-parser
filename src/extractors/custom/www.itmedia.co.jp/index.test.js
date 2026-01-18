import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Mercury from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwItmediaCoJpExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url = 'https://www.itmedia.co.jp/pcuser/articles/1902/22/news089.html';
      const html = fs.readFileSync(
        './fixtures/www.itmedia.co.jp.html',
        'utf-8'
      );
      result = Mercury.parse(url, {
        html,
        fallback: false,
      });
    });

    it('is selected properly', () => {
      // This test should be passing by default.
      // It sanity checks that the correct parser
      // is being selected for URLs from this domain
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      // To pass this test, fill out the title selector
      // in ./src/extractors/custom/www.itmedia.co.jp/index.js.
      const { title } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        title,
        `Intel NUCで最新SSDを比較してみた：さらば平成、さらば水冷、いくぜNUC（1/2 ページ）`
      );
    });

    it('returns the author', async () => {
      // To pass this test, fill out the author selector
      // in ./src/extractors/custom/www.itmedia.co.jp/index.js.
      const { author } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(author, '[田中宏昌，ITmedia]');
    });

    it('returns the date_published', async () => {
      // To pass this test, fill out the date_published selector
      // in ./src/extractors/custom/www.itmedia.co.jp/index.js.
      const { date_published } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(date_published, '2019-02-22T05:37:03.000Z');
    });

    it('returns the dek', async () => {
      // To pass this test, fill out the dek selector
      // in ./src/extractors/custom/www.itmedia.co.jp/index.js.
      const { dek } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        dek,
        'Intelの超小型PC「NUC」を手に入れたとあるユーザーが、ほぼ5年ぶりにPCを自作。今回は完成したNUCを使ってNVMe SSDの最新モデルをチェックしてみました。'
      );
    });

    it('returns the lead_image_url', async () => {
      // To pass this test, fill out the lead_image_url selector
      // in ./src/extractors/custom/www.itmedia.co.jp/index.js.
      const { lead_image_url } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        lead_image_url,
        `https://image.itmedia.co.jp/pcuser/articles/1902/22/cover_news089.jpg`
      );
    });

    it('returns the content', async () => {
      // To pass this test, fill out the content selector
      // in ./src/extractors/custom/www.itmedia.co.jp/index.js.
      // You may also want to make use of the clean and transform
      // options.
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent(
        $('*')
          .first()
          .text(),
        1
      );

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        first13,
        'とある自作PCユーザーが平成最後の年にふと目覚め、ほぼ5年ぶりにPCを新調した経緯をまとめた本連載。前回の記事では、Intelが提唱したNext'
      );
    });
  });
});
