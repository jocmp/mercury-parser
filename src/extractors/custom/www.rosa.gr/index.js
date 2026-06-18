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
    // Combine the article's hero image (.top-row .post-image, which lives in
    // the header outside the body) with the body text (.post-text) so the
    // photo renders inline. The social-follow icons sit in a separate sibling
    // block (.follow-google-news) and are excluded.
    selectors: [['.top-row .post-image', '.post-text']],

    transforms: {
      // Preserve genuine section headings (the read-also widget's heading is
      // already removed by the clean step below, which runs first).
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },

    // Within .post-text, strip the inline "read also" related-article widget
    // (.short-read-also, whose thumbnail links elsewhere), the subscription
    // promo banner (.widget-article), and ad slots.
    clean: ['.short-read-also', '.widget-article', '.ad-placement'],
  },
};
