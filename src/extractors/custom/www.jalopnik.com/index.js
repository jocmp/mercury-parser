export const WwwJalopnikComExtractor = {
  domain: 'www.jalopnik.com',

  title: {
    selectors: [
      ['meta[name="og:title"]', 'value'],
    ],
  },

  author: {
    selectors: [
      ['meta[name="article:author"]', 'value'],
    ],
  },

  date_published: {
    selectors: [
      ['meta[name="article:published_time"]', 'value'],
    ],
  },

  dek: {
    selectors: [
      ['meta[name="og:description"]', 'value'],
    ],
  },

  lead_image_url: {
    selectors: [
      ['meta[name="og:image"]', 'value'],
    ],
  },

  content: {
    selectors: [
      'article.news-post',
    ],

    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
      '.slide-key': node => node.attr('class', 'mercury-parser-keep'),
    },

    clean: [
      '.breadcrumbs',
      '.byline-container',
    ],
  },
}
