export const WwwFuturaSciencesComExtractor = {
  domain: 'www.futura-sciences.com',

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
    selectors: ['#article-anchor-article-main-content', '.article-text'],

    transforms: {
      h2: (node: any) => node.attr('class', 'mercury-parser-keep'),

      h3: (node: any) => node.attr('class', 'mercury-parser-keep'),

      h4: (node: any) => node.attr('class', 'mercury-parser-keep'),

      ul: ($node: any) => $node.attr('class', 'mercury-parser-keep'),
    },

    clean: ['.cWHWfD', 'span[class*="wrappers__Span"]'],
  },
};
