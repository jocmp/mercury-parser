import assert from 'assert';

import Parser from 'mercury';
import getExtractor from 'extractors/get-extractor';

const fs = require('fs');

describe('WwwNexojornalComBrExtractor', () => {
  describe('initial test case', () => {
    let result;
    let url;
    beforeAll(() => {
      url =
        'https://www.nexojornal.com.br/expresso/2026/05/01/biografia-biografo-como-escrever-livro-biografico-dicas';
      const html = fs.readFileSync(
        './fixtures/www.nexojornal.com.br/1777688512312.html'
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
        `Como narrar a vida de alguém, segundo 3 biógrafos`
      );
    });

    it('returns the date_published', async () => {
      const { date_published } = await result;

      assert.strictEqual(date_published, `2026-05-01T22:28:35.000Z`);
    });

    it('returns the dek', async () => {
      const { dek } = await result;

      assert.strictEqual(
        dek,
        'Biografia será um dos gêneros discutidos n’A Feira do Livro, que acontece em maio. Ao ‘Nexo’, autores falam sobre dificuldades e surpresas ao escrever'
      );
    });

    it('returns the lead_image_url', async () => {
      const { lead_image_url } = await result;

      assert.strictEqual(
        lead_image_url,
        `https://nexo-uploads-beta.s3.amazonaws.com/wp-content/uploads/images/2026/04/andrey-metelev-eG_Co1EGUyI-unsplash-640x399.webp`
      );
    });

    it('returns the author', async () => {
      const { author } = await result;

      assert.strictEqual(author, null);
    });
  });
});
