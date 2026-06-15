export const WwwFrandroidComExtractor = {
  domain: 'www.frandroid.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [['meta[name="parsely-author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['section.article-content'],

    transforms: {},

    clean: [
      '.index-menu-wrapper',
      '.is-gastric-kingfisher',
      '.newsletter-form',
      '.share',
      '.article-footer',
      '.js-feed-posts',
      '.optidigital-adslot',
      '[id^="optidigital-adslot"]',
    ],
  },
};
