import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('SubstackComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://garymarcus.substack.com/p/a-model-that-produces-code-which';
      const html = fs.readFileSync(
        './fixtures/substack.com/1777688784578.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, 'substack.com');
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(
        title,
        `“A model that produces code which compiles and passes the tests it was given is not the same as a model that produces correct, secure, maintainable, well-architected software”`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Gary Marcus');
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'A lot of code is being written by AI, but what does it mean?'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://substackcdn.com/image/fetch/$s_!L9Di!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9610e183-b1a7-4522-8838-ec798cec6525_1383x864.png`
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
        'The title here, a paraphrased quote from me, pretty much says it all.'
      );
    });
  });
});
