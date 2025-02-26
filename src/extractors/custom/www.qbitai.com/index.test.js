import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwQbitaiComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url = 'https://www.qbitai.com/2025/02/257352.html';
      const html = fs.readFileSync(
        './fixtures/www.qbitai.com/1740538126401.html'
      );
      result = Parser.parse(url, { html, fallback: false });
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
      // in ./src/extractors/custom/www.qbitai.com/index.js.
      const { title } = await result;

      // Update these values with the expected values from
      // the article.
      assert.strictEqual(
        title,
        `中科闻歌发布智川X-Agent平台、优雅音视频大模型更新 | 量子位`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, null);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, null);
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent(
        $('*')
          .first()
          .text(),
        13
      );

      assert.strictEqual(
        first13,
        '助力政企极速落地AI应用与创意灵感，让AI技术精细化满足真实业务场景，加速AI普惠落地。 允中 发自 凹非寺 量子位 | 公众号 QbitAI 2月22日，中科闻歌2025 AI新产品线上发布会成功举办，升级发布“智川”企业智能体平台1.0与“优雅”音视频大模型平台1.5，助力政企极速落地AI应用与创意灵感，让AI技术精细化满足真实业务场景，加速AI普惠落地。 一站式企业智能体开发平台，个性化AI应用极速落地 智川X-Agent作为面向全行业的企业智能体开发平台，将大模型、知识库、工作流等复杂技术模块封装为可视化的拖拽组件，用户无需编写代码，通过简单的拖拽与配置，即可快速构建符合业务需求的AI应用，将开发周期缩短95%以上，帮助企业实现AI应用极速落地。 △智川X-Agent五层架构'
      );
    });
  });
});
