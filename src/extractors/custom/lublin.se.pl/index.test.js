import assert from 'assert';
import URL from 'url';
import cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('LublinSePlExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://lublin.se.pl/tajemniczy-rozblysk-na-niebie-a-potem-huk-internauci-nagrali-niepokojace-zjawisko-aa-pyCB-it69-KEL7.html';
      const html = fs.readFileSync(
        './fixtures/lublin.se.pl/1740022803567.html'
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
        `Tajemniczy rozbłysk na niebie, a potem huk. Internauci nagrali niepokojące zjawisko`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.equal(author, 'Katarzyna Kapusta - Gruchlik');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.equal(date_published, '2025-02-18T20:58:00.000Z');
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.equal(
        lead_image_url,
        `https://cdn.galleries.smcloud.net/t/galleries/gf-KFrZ-xVXW-9Fop_meteor-1920x1080-nocrop.jpg`
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
        'Mieszkańcy najpierw zobaczyli na niebie intensywnie zieloną smugę, a chwile później usłyszeli głośny'
      );
    });
  });
});
