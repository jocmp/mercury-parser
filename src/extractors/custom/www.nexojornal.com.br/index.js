export const WwwNexojornalComBrExtractor = {
  domain: 'www.nexojornal.com.br',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: null,

  date_published: {
    selectors: [['meta[name="articlePublishTime"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['#__next'],
  },
};
