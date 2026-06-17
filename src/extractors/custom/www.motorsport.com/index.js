export const WwwMotorsportComExtractor = {
  domain: 'www.motorsport.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.msnt-author-toolbar a[href*="/info/about-us/"]'],
  },

  date_published: {
    selectors: [['meta[name="datePublished"]', 'value']],
  },

  dek: {
    selectors: ['h2.text-article-description'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.ms-article-content'],
    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },
    clean: [
      'msnt-survey-promo',
      '.article-fullwidth-gallery_item ~ .article-fullwidth-gallery_item',
      '.ms-inarticle-widgets',
      '.relatedContent',
      '.ms-apb',
      '.ms-ap-native',
      '.outstream_partner',
    ],
  },
};
