export const WwwEuronewsComExtractor = {
  domain: 'www.euronews.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [
      ['meta[name="article:author"]', 'value'],
      '.c-article-contributors',
    ],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  dek: {
    selectors: ['h2.c-article-summary'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.c-article-content', 'article'],
    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
      '.widget__figure': node => node.addClass('mercury-parser-keep'),
    },
    clean: ['.c-ad', '.c-widget-related', '.connatix-container'],
  },
};
