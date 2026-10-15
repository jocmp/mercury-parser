export const EditoMeilleursagentsComExtractor = {
  domain: 'edito.meilleursagents.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.field--name-uid .username'],
  },

  date_published: {
    selectors: [['.field--name-published-at time', 'datetime']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.main-contenu'],

    clean: [
      '.visually-hidden',
      '.field--name-field-sommaire',
      '.paragraph--type--texte-cta',
    ],
  },
};
