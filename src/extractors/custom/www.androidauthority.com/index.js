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
      h2: $node => {
        // Some pages have an element h2 that is significant, and that the parser will
        // remove if not following a paragraph. Adding this empty paragraph fixes it, and
        // the empty paragraph will be removed anyway.
        $node.before('<p></p>');
      },
    },
    clean: [
      '.d_f .d_nr', // Lead image
    ],
  },
};
