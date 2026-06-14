import assert from 'assert';
import * as cheerio from 'cheerio';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';
import { excerptContent } from 'utils/text';

const fs = require('fs');

describe('ActualidadRtComExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://actualidad.rt.com/actualidad/603743-iran-afirma-onu-garantizara-navegacion';
      const html = fs.readFileSync(
        './fixtures/actualidad.rt.com/1781468121405.html'
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
        `Irán afirma ante la ONU que garantizará la navegación en Ormuz con esta condición`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, `RT en Español`);
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-05-07T22:03:26.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'Amir Saeid Iravani denunció que "las acciones de EE.UU. contradicen flagrantemente sus objetivos declarados y solo han servido para intensificar las tensiones".'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://mf.b37mrtl.ru/actualidad/public_images/2026.05/article/69fcfeb1e9ff710ff61e5ff9.jpg`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'El representante permanente de Irán ante la ONU, Amir Saeid Iravani, ha afirmado'
      );
    });
  });

  describe('image-heavy article', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://actualidad.rt.com/a-fondo/610168-almuerzo-salvo-mundo-desastre-nuclear';
      const html = fs.readFileSync(
        './fixtures/actualidad.rt.com/1781469971715.html'
      );
      result = Parser.parse(url, { html, fallback: false });
    });

    it('returns the title', async () => {
      const { title } = await result;

      assert.strictEqual(
        title,
        `El almuerzo que salvó al mundo de un desastre nuclear en 1962`
      );
    });

    it('returns the content', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');

      const first13 = excerptContent($('*').first().text(), 13);

      assert.strictEqual(
        first13,
        'La Crisis de los Misiles de Cuba en 1962 estuvo a punto de'
      );
    });

    it('resolves inline images to real URLs', async () => {
      const { content } = await result;

      const $ = cheerio.load(content || '');
      const images = $('img').toArray();

      assert.ok(images.length > 0, 'expected inline images in the content');

      images.forEach(img => {
        const src = $(img).attr('src') || '';
        assert.ok(
          /^https?:\/\//.test(src),
          `expected a real image URL, got: ${src}`
        );
      });
    });
  });
});
