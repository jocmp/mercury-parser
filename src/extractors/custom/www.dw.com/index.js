export const WwwDwComExtractor = {
  domain: 'www.dw.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.author-name .author-link'],
  },

  date_published: {
    selectors: [['meta[name="date"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['[data-tracking-name="rich-text"]'],

    transforms: {
      // DW inline images are responsive: the real template lives in data-url
      // with a literal ${formatId} size token that JS would replace, leaving a
      // broken src in the raw HTML. Resolve it to a standard content size.
      img: node => {
        const template = node.attr('data-url') || node.attr('src') || '';
        if (template.includes('${formatId}')) {
          node.attr('src', template.replace('${formatId}', '6'));
        }
      },
    },

    // Embedded tweets are non-functional fallback markup without JS.
    clean: ['blockquote.tweet.embed'],
  },
};
