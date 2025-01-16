export const GithubComExtractor = {
  domain: 'github.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.author'],
  },

  date_published: {
    selectors: [['meta[name="og:updated_time"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.commit'],

    transforms: {
      '.commit': node => {
        const title = node.find('.commit-title').text();
        const description = node.find('.commit-desc pre');

        if (title.includes('…')) {
          const text = `${title.trim()}${description.text()}`.replaceAll(
            '…',
            ''
          );

          node.empty().append(text);
        } else {
          node.empty().append(description);
        }
      },
    },

    clean: [],
  },
};
