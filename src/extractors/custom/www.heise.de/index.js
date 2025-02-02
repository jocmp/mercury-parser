export const WwwHeiseDeExtractor = {
  domain: 'www.heise.de',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [['meta[name="author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="date"]', 'value']],
  },

  dek: {
    selectors: ['.a-article-header__lead'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.article-layout__content'],

    transforms: {
      h3: $node => $node.attr('class', 'mercury-parser-keep'),
    },

    clean: [
      '.ad-mobile-group-1',
      '.branding',
      '[data-component="RecommendationBox"]',
    ],
  },
};
