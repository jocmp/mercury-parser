export const WwwDwComExtractor = {
  domain: 'www.dw.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.author-name .author-link'],
  },

  date_published: {
    selectors: [['meta[name="date"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['[data-tracking-name="rich-text"]'],

    transforms: {},

    clean: [],
  },
};
