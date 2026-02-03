export const WwwMotorsportComExtractor = {
  domain: 'www.motorsport.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.msnt-author-toolbar .msnt-userpic + div a'],
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
    selectors: ['.ms-article-content', 'article'],
    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },
    clean: ['.relatedContent', '.ms-apb', '.ms-ap-native', '.outstream_partner'],
  },
};
