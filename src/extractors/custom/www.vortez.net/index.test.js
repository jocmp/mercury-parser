import assert from 'assert';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwVortezNetExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.vortez.net/news_story/deepcool_launches_ch690_digital_with_built_in_real_time_system_monitoring.html';
      const html = fs.readFileSync(
        './fixtures/www.vortez.net/1743645797430.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(
        title,
        `DeepCool Launches CH690 DIGITAL With Built-in Real-Time System Monitoring`
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

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://www.vortez.net/news_teaserimage/11779`
      );
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
        'DeepCool announced the launch of the CH690 DIGITAL, a next-generation PC case that'
      );
    });
  });
});
