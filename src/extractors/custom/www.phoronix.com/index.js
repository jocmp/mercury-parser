export const WwwPhoronixComExtractor = {
  domain: 'www.phoronix.com',

  title: {
    selectors: ['article h1', 'article header'],
  },

  author: {
    selectors: ['.author a:first-child'],
  },

  date_published: {
    selectors: ['.author'],
    // 1 June 2019 at 08:34 PM EDT
    format: 'D MMMM YYYY at hh:mm',
    timezone: 'America/New_York',
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.content', 'article'],
    defaultCleaner: false,
    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },
    clean: [],
  },
};
