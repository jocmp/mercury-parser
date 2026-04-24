export const WwwIlfattoquotidianoItExtractor = {
  domain: 'www.ilfattoquotidiano.it',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.ifq-post__author .ifq-news-meta__author-name'],
    clean: ['span'],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.ifq-post__content', 'article'],

    transforms: {},

    clean: [],
  },
};
