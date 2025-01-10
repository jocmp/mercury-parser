import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwSpiegelDeExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.spiegel.de/netzwelt/gadgets/ces-2025-nvidia-stellt-ki-supercomputer-im-schreibtisch-format-vor-a-0e0ad625-920d-4a99-a04d-3803ea71974c';
      const html = fs.readFileSync(
        './fixtures/www.spiegel.de/1736474444948.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.equal(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.equal(
        title,
        `CES 2025: Nvidia stellt KI-Supercomputer im Schreibtisch-Format vor`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, 'DER SPIEGEL');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, `2025-01-07T08:41:00.000Z`);
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://cdn.prod.www.spiegel.de/images/8fb25d3c-b196-43b7-bf9d-ad56918e35d5_w1200_r1.778_fpx56.57_fpy50.88.jpg`
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

      assert.equal(
        first13,
        'Der Chipkonzern Nvidia will einen KI-Supercomputer auf Schreibtische bringen. Firmenchef Jensen Huang stellte'
      );
    });
  });
});
