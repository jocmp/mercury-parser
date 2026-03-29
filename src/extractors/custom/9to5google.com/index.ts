export const Nineto5googleComExtractor = {
  domain: '9to5google.com',

  title: {
    selectors: ['title', 'h1'],
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
    selectors: ['main'],

    transforms: {
      img: node => {
        node.removeAttr('sizes');
      },
    },

    clean: ['.post-meta'],
  },
};
