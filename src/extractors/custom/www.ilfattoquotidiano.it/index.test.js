import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwIlfattoquotidianoItExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.ilfattoquotidiano.it/2026/04/20/bayern-monaco-campione-bundesliga-triplete-favorita-perche/8360544/';
      const html = fs.readFileSync(
        './fixtures/www.ilfattoquotidiano.it/1776963007735.html'
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
        `Il Bayern Monaco fa la storia con 109 gol: ora punta al clamoroso Triplete`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Daniele Fiori');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-04-20T09:04:27.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'La squadra di Kompany ha conquistato il titolo tedesco con una media di 3,6 gol a partita. Le rivali europee intanto arrancano'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://st.ilfattoquotidiano.it/wp-content/uploads/2026/04/20/24344520_small-1200x630.jpg`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'Il Bayern Monaco domenica ha battuto per 4 a 2 lo Stoccarda conquistando'
      );
    });
  });
});
