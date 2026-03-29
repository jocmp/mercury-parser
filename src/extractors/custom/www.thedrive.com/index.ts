export const WwwThedriveComExtractor = {
  domain: 'www.thedrive.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
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
    selectors: ['.entry-content', 'article'],

    transforms: {
      img: (node: any) => {
        node.removeAttr('sizes');
      },
      h2: (node: any) => node.attr('class', 'mercury-parser-keep'),
      h3: (node: any) => node.attr('class', 'mercury-parser-keep'),
    },

    clean: [
      '.product-disclosure',
      '.recurrent-newsletter-block',
      '.pw-incontent-commerce-ad',
      '#author-widgets',
    ],
  },
};
