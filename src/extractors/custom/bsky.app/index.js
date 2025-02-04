export const BskyAppExtractor = {
  domain: 'bsky.app',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [],
  },

  date_published: {
    allowMultiple: true,
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  lead_image_url: null,

  content: {
    selectors: ['#bsky_post_text'],

    transforms: {},

    clean: [],
  },
};
