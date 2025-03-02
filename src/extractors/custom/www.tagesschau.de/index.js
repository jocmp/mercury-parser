export const WwwTagesschauDeExtractor = {
  domain: 'www.tagesschau.de',

  title: {
    selectors: ['.seitenkopf__headline--text', 'title'],
  },

  author: {
    selectors: ['.authorline__author authorline__link:first-child'],
  },

  date_published: {
    selectors: [['meta[name="date"]', 'value'], '.metatextline'],
    timezone: 'UTC',
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['article'],

    clean: [
      '[data-config]',
      '.seitenkopf__headline',
      '.authorline__author',
      '.metatextline',
    ],
  },
};
