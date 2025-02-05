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

    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },

    clean: [
      '.article__author__croppimg', // author photo
    ],
  },
};
