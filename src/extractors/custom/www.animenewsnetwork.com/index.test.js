import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwAnimenewsnetworkComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.animenewsnetwork.com/news/2026-06-14/school-of-horns-mito-aoi-launches-new-manga/.238512';
      const html = fs.readFileSync(
        './fixtures/www.animenewsnetwork.com/1781536993736.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(title, `School of Horns' Mito Aoi Launches New Manga`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-06-15T15:15:00.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'Aoi, Meza Tōno launch Koko ni Fukuen Flag ga Tatteimasu manga'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://www.animenewsnetwork.com/thumbnails/crop600x315gIB/cms/news.9/238512/fukuenflag.jpg`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'Aoi, Meza Tōno launch Koko ni Fukuen Flag ga Tatteimasu manga Image via'
      );
    });

    it('resolves lazy-loaded images to real URLs', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');
      const images = $('img').toArray();

      assert.ok(images.length > 0, 'expected inline images in the content');
      assert.ok(
        !(content || '').includes('spacer.gif'),
        'expected no spacer.gif placeholders to remain'
      );

      images.forEach(img => {
        const src = $(img).attr('src') || '';
        assert.ok(
          /^https?:\/\//.test(src),
          `expected an absolute image URL, got: ${src}`
        );
      });
    });
  });
  describe('news with dense encyclopedia links', () => {
    let result;
    beforeAll(() => {
      const url =
        'https://www.animenewsnetwork.com/news/2026-06-20/viz-media-releases-yukiaki-kurando-wooma-kiss-me-with-your-face-manga-in-english/.238726';
      const html = fs.readFileSync(
        './fixtures/www.animenewsnetwork.com/1782011300000.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('keeps the body and its image', async () => {
      const { content } = await result;

      assert.ok(
        content.includes('announced on Friday that it has licensed storywriter')
      );
      assert.ok(
        content.includes(
          'src="https://cdn.animenewsnetwork.com/thumbnails/max300x600/cms/news.9/238726/face.jfif.jpeg"'
        )
      );
    });

    it('keeps the intro and cleans the audio player', async () => {
      const { content } = await result;

      assert.ok(content.includes('Manga about classmates who swap bodies'));
      assert.ok(!content.includes('instaread'));
    });
  });

  describe('review with layout tables', () => {
    let result;
    beforeAll(() => {
      const url =
        'https://www.animenewsnetwork.com/review/we-are-aliens-anime-movie/.238373';
      const html = fs.readFileSync(
        './fixtures/www.animenewsnetwork.com/1782011200000.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('unwraps the layout tables', async () => {
      const { content } = await result;

      assert.ok(
        content.includes("I've never seen a movie that looks quite like")
      );
      assert.ok(content.includes('Tsubasa and Gyotaro are best friends'));
      assert.ok(!content.includes('<table'));
    });

    it('labels the synopsis and review', async () => {
      const { content } = await result;

      const synopsis = content.indexOf('<strong>Synopsis:</strong>');
      const review = content.indexOf('<strong>Review:</strong>');
      const synopsisText = content.indexOf(
        'Tsubasa and Gyotaro are best friends'
      );

      assert.ok(synopsis >= 0);
      assert.ok(synopsis < synopsisText);
      assert.ok(review > synopsisText);
      assert.ok(review < content.indexOf("I've never seen a movie"));
    });

    it('keeps a single cover image', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');
      const covers = $('img')
        .toArray()
        .filter(img => ($(img).attr('src') || '').includes('we-are-aliens'));

      assert.strictEqual(covers.length, 1);
    });
  });
  describe('nested layout tables', () => {
    let content;
    beforeAll(async () => {
      const html = `
        <html><body><div class="KonaBody">
        <table class="layout"><tbody>
          <tr>
            <td class="horizontal"><span style="position:absolute">Synopsis:</span></td>
            <td>
              <div class="floating-image fleft">
                <table class="layout"><tbody><tr>
                  <td><img src="//cdn.animenewsnetwork.com/nested-cover.jpg" width="200" height="300"></td>
                  <td class="vertical"><div></div></td>
                </tr></tbody></table>
              </div>
            </td>
          </tr>
          <tr>
            <td class="text-zone"><p>A synopsis that is long enough to read as article content, with some detail.</p></td>
            <td><iframe src="https://www.youtube.com/embed/abc123" width="640" height="360"></iframe></td>
          </tr>
          <tr><td class="horizontal"><b>Review:</b></td><td class="vertical"></td></tr>
        </tbody></table>
        <p>The review body follows the layout table, and it runs long enough to count as content.</p>
        </div></body></html>
      `;
      ({ content } = await Parser.parse(
        'https://www.animenewsnetwork.com/review/example/.1',
        { html, fallback: false }
      ));
    });

    it('unwraps nested layout tables', () => {
      assert.ok(!content.includes('<table'));
      assert.strictEqual(content.split('nested-cover.jpg').length - 1, 1);
      assert.strictEqual(content.split('Synopsis:').length - 1, 1);
    });

    it('keeps media-only layout cells', () => {
      assert.ok(content.includes('https://www.youtube.com/embed/abc123'));
    });

    it('keeps labels wrapped in elements', () => {
      assert.ok(content.includes('<strong>Synopsis:</strong>'));
      assert.ok(content.includes('<strong>Review:</strong>'));
    });
  });
});
