export const OrfAtExtractor = {
  domain: 'orf.at',

  title: {
    selectors: ['title'],
  },

  date_published: {
    selectors: [['meta[name="dc.date"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['main'],

    transforms: {},

    clean: ['.story-meta'],
  },
};
