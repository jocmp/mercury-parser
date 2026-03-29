export const WwwVortezNetExtractor = {
  domain: 'www.vortez.net',

  title: {
    selectors: ['title'],
  },

  dek: {
    selectors: [],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  next_page_url: {
    selectors: ['.pagelink:nth-child(2) > a'],
  },

  content: {
    selectors: ['.main-content', '.the-article-content'],

    transforms: {
      strong: 'p',
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },

    clean: ['.article-header', '.panel-title', 'select', 'br'],
  },
};
