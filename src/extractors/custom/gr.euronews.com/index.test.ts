import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('GrEuronewsComExtractor', () => {
  describe('initial test case', () => {
    let result: any;
    let url: string;
    beforeAll(() => {
      url =
        'http://gr.euronews.com/my-europe/2026/03/24/amerikanos-presvhs-ee-aporripsh-emporikh-sumfwnia-oikonomikh-ameleia';
      const html =
        fs.readFileSync('./fixtures/gr.euronews.com/1774399621925.html');
      result =
        Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);
      assert.strictEqual(extractor.domain, new URL(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;
      assert.strictEqual(
        title,
        'Αμερικανός πρέσβης στην ΕΕ: Η απόρριψη της εμπορικής συμφωνίας ΗΠΑ-ΕΕ είναι «οικονομική αμέλεια»'
      );
    });

    it('returns the author', async () => {
      const { author } = await result;
      assert.strictEqual(
        author,
        'Από\u00a0Méabh Mc Mahon\u00a0&\u00a0Aida Sanchez Alonso'
      );
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;
      assert.strictEqual(date_published, '2026-03-24T20:30:04.000Z');
    });

    it('returns the dek', async () => {
      const { dek } = await result;
      assert.strictEqual(
        dek,
        'Ο Άντριου Πάζντερ δηλώνει ότι η Ουάσινγκτον είναι «ανήσυχη» για την έγκριση της συμφωνίας στην ψηφοφορία του Ευρωπαϊκού Κοινοβουλίου αυτή την Πέμπτη'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;
      assert.strictEqual(
        lead_image_url,
        'https://images.euronews.com/articles/stories/09/69/51/08/1200x675_cmsv2_6931d58d-5046-534e-886b-d88da18f606a-9695108.jpg'
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'Σε συνέντευξή του στην κορυφαία πρωινή εκπομπή Europe Today του Euronews, ο πρέσβης'
      );
    });
  });
});
