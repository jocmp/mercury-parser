export const WwwSpiegelDeExtractor = {
  domain: 'www.spiegel.de',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [['meta[name="author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="date"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['div[data-area="body"]', 'article'],
    transforms: {},

    clean: [],
  },
};
