export const WwwChannelnewsasiaComExtractor = {
  domain: 'www.channelnewsasia.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [
      '.link--author-profile',
      ['meta[name="cXenseParse:author"]', 'value'],
    ],
  },

  date_published: {
    selectors: ['.article-publish:not(span)'],
    format: 'DD MMM YYYY HH:mma',
    timezone: 'Asia/Singapore',
  },

  dek: {
    selectors: ['.content-detail__description'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['section[data-title="Content"]'],

    transforms: {},

    clean: [],
  },
};
