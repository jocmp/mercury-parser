export const WwwHardwarezoneComSgExtractor = {
  domain: 'www.hardwarezone.com.sg',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.article-view-author-name a'],
  },

  date_published: {
    selectors: ['.article-view-timestamp'],
    timezone: 'UTC',
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.content'],
    transforms: {},
    clean: [],
  },
};
