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

  // Some pages have a nested header elements that are significant, and that the parser will
  // remove if not following a paragraph. Adding this empty paragraph fixes it, and
  // the empty paragraph will be removed anyway.
  content: {
    selectors: ['.e_Bc', '.d_Dd'],
    transforms: {
      ol: node => {
        node.attr('class', 'mercury-parser-keep');
      },
      h2: $node => $node.attr('class', 'mercury-parser-keep'),
      h3: $node => $node.attr('class', 'mercury-parser-keep'),
    },
    clean: [
      '.e_Oh', // Polls
      'picture + div', // Lead image text
    ],
  },
};
