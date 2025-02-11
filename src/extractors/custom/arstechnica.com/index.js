export const ArstechnicaComExtractor = {
  domain: 'arstechnica.com',

  title: {
    selectors: ['title', 'h1'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['main'],

    transforms: {},

    clean: ['.upper-deck__text', '.text-settings-dropdown-story'],
  },
};
