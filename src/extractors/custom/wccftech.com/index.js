export const WccftechComExtractor = {
  domain: 'wccftech.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['div.meta a:first-of-type'],
  },

  date_published: {
    selectors: [
      ['meta[name="pub_date"]', 'value'],
      ['meta[name="article:published_time"]', 'value'],
    ],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.content'],
    transforms: {},
    clean: [
      '.democracy', // JavaScript polls
    ],
  },
};
