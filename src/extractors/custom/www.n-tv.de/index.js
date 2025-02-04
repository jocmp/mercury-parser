export const WwwNtvDeExtractor = {
  domain: 'www.n-tv.de',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="date"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.article__text', 'article'],

    transforms: {},

    clean: ['.article__share-main'],
  },
};
