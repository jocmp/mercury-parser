export const WwwFlatpanelshdComExtractor = {
  domain: 'www.flatpanelshd.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [['meta[itemprop="author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[itemprop="datePublished"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['#zephr-anchor', 'article'],

    transforms: {
      h2: ($node: any) => $node.attr('class', 'mercury-parser-keep'),

      h3: ($node: any) => $node.attr('class', 'mercury-parser-keep'),

      h4: ($node: any) => $node.attr('class', 'mercury-parser-keep'),

      pre: 'div',
    },

    clean: [],
  },
};
