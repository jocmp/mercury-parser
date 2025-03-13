export const TarnkappeInfoExtractor = {
  domain: 'tarnkappe.info',

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
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },

    clean: ['section#author'],
  },
};
