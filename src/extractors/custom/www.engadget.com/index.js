export const WwwEngadgetComExtractor = {
  domain: 'www.engadget.com',

  title: {
    selectors: ['title', 'h1'],
  },

  author: {
    selectors: ['.caas-attr-item-author'],
  },

  date_published: {
    selectors: [['time', 'datetime']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.caas-body'],

    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
      // '.youtube iframe': node => node.attr('class', 'mercury-parser-keep'),
      noscript: node => {
        const iframe = node.find('iframe');
        const noscriptParent = node.parent();

        if (iframe != null && noscriptParent.prop('tagName') === 'BLOCKQUOTE') {
          node.parent().replaceWith(iframe);
        }
      },
    },

    clean: [],
  },
};
