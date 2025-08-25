export const WwwThehinduComExtractor = {
  domain: 'www.thehindu.com',

  title: {
    selectors: [
      ['meta[property="og:title"]', 'value'],
      ['meta[name="title"]', 'value'],
      ['meta[name="twitter:title"]', 'value'],
      ['meta[name="cXenseParse:title"]', 'value'],
    ],
  },

  author: {
    selectors: [
      ['meta[property="article:author"]', 'value'],
      ['meta[name="author"]', 'value'],
      ['meta[name="twitter:creator"]', 'value'],
    ],
  },

  date_published: {
    selectors: [
      ['meta[property="article:published_time"]', 'value'],
      ['meta[name="publish-date"]', 'value'],
    ],
  },

  lead_image_url: {
    selectors: [
      ['meta[property="og:image"]', 'value'],
      ['meta[name="twitter:image"]', 'value'],
    ],
  },

  content: {
    selectors: ['div[itemprop="articleBody"]'],

    // Is there anything in the content you selected that needs transformed
    // before it's consumable content? E.g., unusual lazy loaded images
    transforms: {},

    // Is there anything that is in the result that shouldn't be?
    // The clean selectors will remove anything that matches from
    // the result
    clean: ['div.article-ad', 'div[data-ga-label="AlsoReadArticle"]'],
  },
};
