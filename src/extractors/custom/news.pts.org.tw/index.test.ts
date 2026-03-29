import assert from 'assert';
import * as cheerio from 'cheerio';

import Mercury from 'mercury';
import getExtractor from 'extractors/get-extractor';

const fs = require('fs');

describe('NewsPtsOrgTwExtractor', () => {
  describe('water bankruptcy article', () => {
    let result;
    let url;
    beforeAll(() => {
      url = 'https://news.pts.org.tw/article/791685';
      const html = fs.readFileSync('./fixtures/news.pts.org.tw.html');
      result = Mercury.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(
        title,
        '聯合國示警邁入「水資源破產時代」 每年40億人至少缺水1個月'
      );
    });

    it('returns the content', async () => {
      const { content } = await result;
      const $ = cheerio.load(content || '');
      const text = $('*')
        .first()
        .text();
      assert.ok(text.includes('聯合國20日示警，全球已進入「水資源破產時代」'));
    });
  });

  describe('impeachment article', () => {
    let result;
    let url;
    beforeAll(() => {
      url = 'https://news.pts.org.tw/article/791642';
      const html = fs.readFileSync('./fixtures/news.pts.org.tw--hot_topics.html');
      result = Mercury.parse(url, { html, fallback: false });
    });

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(
        title,
        '賴清德未出席立院彈劾審查會強調立院無直接向總統問責之權'
      );
    });

    it('returns the content', async () => {
      const { content } = await result;
      const $ = cheerio.load(content || '');
      const text = $('*')
        .first()
        .text();
      assert.ok(text.includes('立法院藍白黨團發起總統彈劾案'));
      assert.ok(text.includes('確定不會出席'));
    });
  });
});
