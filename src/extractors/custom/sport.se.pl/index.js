export const SportSePlExtractor = {
  domain: 'sport.se.pl',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.article_author'],
  },

  date_published: {
    selectors: ['#timezone'],
    timezone: 'Europe/Warsaw',
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['article'],

    transforms: {},

    clean: [
      '.single-photo:has(.author)', // author photo
    ],
  },
};
