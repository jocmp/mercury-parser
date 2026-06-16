export const WwwRosaGrExtractor = {
  domain: 'www.rosa.gr',

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
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.post-text'],

    transforms: {},

    // The article body is .post-text; the social-follow icons live in a
    // sibling block (.follow-google-news) and are excluded by the selector.
    // Within .post-text, strip the inline "read also" related-article widget
    // (.short-read-also, whose thumbnail links elsewhere), the subscription
    // promo banner (.widget-article), and ad slots.
    clean: ['.short-read-also', '.widget-article', '.ad-placement'],
  },
};
