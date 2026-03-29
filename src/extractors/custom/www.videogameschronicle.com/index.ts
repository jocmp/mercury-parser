export const WwwVideogameschronicleComExtractor = {
  domain: 'www.videogameschronicle.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.author-byline a[rel="author"]'],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  content: {
    selectors: ['.post__content-body', 'article'],

    transforms: {
      'figure a': $node => {
        const href = $node.attr('href');
        const $img = $node.find('img');
        if (href && $img.length && !$img.attr('src')) {
          $img.attr('src', href);
          $node.replaceWith($img);
        }
      },
    },

    clean: ['.adcontainer'],
  },
};
