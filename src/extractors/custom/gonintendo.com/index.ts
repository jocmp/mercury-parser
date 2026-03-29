export const GonintendoComExtractor = {
  domain: 'gonintendo.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="og:article:published_time"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.content'],

    transforms: {},

    clean: ['.text-brand-gray-600'],
  },
};
