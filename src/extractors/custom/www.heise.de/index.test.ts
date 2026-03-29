import assert from 'assert';
import URL from 'url';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('WwwHeiseDeExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.heise.de/hintergrund/Secure-Coding-Passwort-Hashing-zum-Schutz-vor-Brute-Force-und-Rainbow-Tabellen-10265244.html';
      const html = fs.readFileSync(
        './fixtures/www.heise.de/1738467011295.html',
        'utf-8'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('is selected properly', () => {
      const extractor = getExtractor(url);

      assert.strictEqual(extractor.domain, URL.parse(url).hostname);
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(
        title,
        `Secure Coding: Passwort-Hashing zum Schutz vor Brute-Force und Rainbow-Tabellen`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, 'Sven Ruppert');
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2025-02-01T07:36:00.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'Warum sichere Passwörter wichtig sind und welche Hashing-Algorithmen Java-Anwendung sowie Benutzerkonten zuverlässig vor Hackern schützen.'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://heise.cloudimg.io/bound/1200x1200/q85.png-lossy-85.webp-lossy-85.foil1/_www-heise-de_/imgs/18/4/7/9/2/3/6/9/SC13-Passwords-e38c24ba084ea5a9.jpg`
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
        'Inhaltsverzeichnis Passwortsicherheit ist ein häufig unterschätztes, aber kritisches Thema in der Softwareentwicklung. Immer'
      );
    });
  });
});
