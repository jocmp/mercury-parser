export const SgNewsYahooComExtractor = {
  domain: 'sg.news.yahoo.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value'], 'title'],
  },

  author: {
    selectors: ['.caas-attr-provider', 'meta[name="author"]'],
  },

  date_published: {
    selectors: ['time[datetime]', 'meta[property="article:published_time"]'],
    timezone: 'UTC',
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.caas-body-content', 'article'],

    transforms: {},

    clean: [
      '.caas-header',
      '.caas-logo',
      '.caas-title-wrapper',
      'button',
      '.advertisement',
      '.sda-*',
      '[data-content="Advertisement"]',
    ],
  },
};
