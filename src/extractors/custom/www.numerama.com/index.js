export const WwwNumeramaComExtractor = {
  domain: 'www.numerama.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [['meta[name="author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  dek: {
    selectors: ['.article-header__description'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.article-content', 'article'],

    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },

    clean: [
      '.js-newsletter-block',
      '.premium-promo-alert',
      '[data-nosnippet]',
      '.ultimedia_cntr',
    ],
  },
};
