export const WwwAndroidauthorityComExtractor = {
  domain: 'www.androidauthority.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value'], 'h1'],
  },

  author: {
    selectors: ['button.d_ic'],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },
  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.d_Dd'],
    transforms: {
      ol: node => {
        node.attr('class', 'mercury-parser-keep');
      },
    },
    clean: [
      '.d_f .d_nr', // Lead image
    ],
  },
};
