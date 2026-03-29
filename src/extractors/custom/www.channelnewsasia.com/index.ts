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
    format: 'D MMM YYYY hh:mmA',
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

    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },

    clean: [],
  },
};
