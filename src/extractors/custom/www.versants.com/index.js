export const WwwVersantsComExtractor = {
  domain: 'www.versants.com',

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
    transforms: {
      '.featured-image': $node => {
        $node.addClass('mercury-parser-keep');
        const figcaption = $node.find('span');
        $node.find('figure').append(figcaption);
      },
    },
    selectors: ['.article-content'],
    clean: [
      '.adv-link',
      '.versa-target',
      'header', // Clean title
      '.author', // Clean author
      '.thumbnail-slider', // Remove, the main images will be within the .main-slider div.
    ],
  },
};
