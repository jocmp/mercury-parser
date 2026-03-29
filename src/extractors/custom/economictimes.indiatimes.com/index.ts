export const EconomictimesIndiatimesComExtractor = {
  domain: 'economictimes.indiatimes.com',

  title: {
    selectors: ['title', ['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['a[rel="author"]'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['article'],

    transforms: {},

    clean: ['span.imgAgency'],
  },
};
