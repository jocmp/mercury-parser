export const WwwDigitalfoundryNetExtractor = {
  domain: 'www.digitalfoundry.net',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [['meta[name="author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.article-text', 'article'],

    transforms: {
      'iframe[data-src]': node => {
        node.attr('src', node.attr('data-src'));
      },
    },

    clean: ['.youtube-sub', '.object-related', '.poll', '.insert', '.see-also'],
  },
};
