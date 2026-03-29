export const MobilesyrupComExtractor = {
  domain: 'mobilesyrup.com',

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
    selectors: [
      // enter selectors
    ],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.article-content'],

    transforms: {
      '.article-content > ul': node => {
        node.attr('class', 'mercury-parser-keep');
      },
    },

    clean: [],
  },
};
