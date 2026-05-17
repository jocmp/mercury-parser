export const SubstackComExtractor = {
  domain: 'substack.com',

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
    selectors: ['.available-content'],

    transforms: {
      'div.captioned-image-container': 'figure',
      'div.image-link': $node => {
        $node.replaceWith($node.find('img'));
      },
    },

    clean: [
      '.subscribe-widget',
      '.subscription-widget-wrap',
      '.subscription-widget-wrap-editor',
      '.button-wrapper',
      '.poll-embed',
      '.share-dialog',
    ],
  },
};
