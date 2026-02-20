export const ChicagoyimbyComExtractor = {
  domain: 'chicagoyimby.com',

  title: {
    selectors: ['h1.post-title'],
  },

  author: {
    selectors: ['.entry-meta-author a'],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.entry-content'],

    transforms: {
      img: node => {
        node.removeAttr('sizes');
      },
    },

    clean: ['.breadcrumb'],
  },
};
