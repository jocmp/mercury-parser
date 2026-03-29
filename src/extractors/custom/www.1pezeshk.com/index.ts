export const Www1pezeshkComExtractor = {
  domain: 'www.1pezeshk.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value'], 'h1.post-title'],
  },
  author: {
    selectors: [['meta[name="author"]', 'value']],
  },
  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },
  lead_image_url: {
    selectors: [['.featured-area img', 'src']],
  },
  content: {
    selectors: ['article > .entry-content'],

    transforms: {
      img: $node => {
        $node.src = decodeURIComponent($node.src);
      },
    },

    // Is there anything that is in the result that shouldn't be?
    // The clean selectors will remove anything that matches from
    // the result
    clean: [],
  },
};
