export const NewsPtsOrgTwExtractor = {
  domain: 'news.pts.org.tw',

  title: {
    selectors: ['h1.article-title'],
  },

  author: {
    selectors: [['meta[name="author"]', 'content'], ['meta[name="author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[property="article:published_time"]', 'content'], ['meta[name="article:published_time"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="description"]', 'content'], ['meta[name="description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[property="og:image"]', 'content'], ['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.post-article', '.article-content'],

    // Is there anything in the content you selected that needs transformed
    // before it's consumable content? E.g., unusual lazy loaded images
    transforms: {},

    // Is there anything that is in the result that shouldn't be?
    // The clean selectors will remove anything that matches from
    // the result
    clean: ['.articleimg', 'ul'],
  },
};
