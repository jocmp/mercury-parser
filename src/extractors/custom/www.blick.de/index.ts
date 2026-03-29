export const WwwBlickDeExtractor = {
  domain: 'www.blick.de',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.article-meta__author'],
  },

  date_published: {
    selectors: [['time.article-meta__date[datetime]', 'datetime']],
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['article'],
    defaultCleaner: false,
    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
      'figcaption details': (node) => {
        const text = node.text();
        node.replaceWith(`<span>${text}</span>`);
      },
      'ul.gallery__item-wrapper': 'div',
      'li.gallery__item': 'div',
    },
    clean: [
      '.section-header',
      '.article__footer',
      '.social-button-container',
      '.gallery__button',
      '.gallery__position-label',
      '.detail-img__caption-toggle',
      '.nativendo-mid-article',
      '.taboola-mid-article',
      'article > p',
    ],
  },
};
