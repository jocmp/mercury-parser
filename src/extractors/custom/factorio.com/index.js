export const FactorioComExtractor = {
  domain: 'factorio.com',

  title: {
    selectors: ['title'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: [['.blog-post', 'div:nth-child(2)']],

    transforms: {
      h3: node => {
        const author = node.find('author');

        if (author.text()) {
          node.after(`<p>${author.text()}</p>`);

          author.remove();
        }
      },
    },

    clean: ['.logo-expansion-space-age'],
  },
};
