export const BskyAppExtractor = {
  domain: 'bsky.app',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: null,

  date_published: null,

  lead_image_url: null,

  content: {
    selectors: ['#bsky_post_text'],

    transforms: {},

    clean: [],
  },
};
