export const ArstechnicaComExtractor = {
  domain: 'arstechnica.com',

  title: {
    selectors: ['title', 'h1'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.post-content', 'main'],

    transforms: {
      img: $node => {
        $node.removeAttr('width');
        $node.removeAttr('sizes');
      },
    },

    clean: ['header', '.upper-deck__text', '.text-settings-dropdown-story'],
  },
};
