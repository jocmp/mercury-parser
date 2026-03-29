export const IciRadioCanadaCaExtractor = {
  domain: 'ici.radio-canada.ca',

  title: {
    selectors: [['meta[name="dc.title"]', 'value']],
  },

  author: {
    selectors: [['meta[name="dc.creator"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="dc.date.created"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['article main', 'article'],
    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
      ul: node => node.attr('class', 'mercury-parser-keep'),
    },
    clean: [
      'header',
      'nav',
      'button',
      'figcaption',
      '[class*="adBox"]',
      '.framed',
    ],
  },
};
