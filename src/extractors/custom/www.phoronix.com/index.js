export const WwwPhoronixComExtractor = {
  domain: 'www.phoronix.com',

  title: {
    selectors: ['article h1', 'article header'],
  },

  author: {
    selectors: ['.author a:first-child'],
  },

  date_published: {
    selectors: ['.author'],
    // 1 June 2019 at 08:34 PM EDT
    format: 'D MMMM YYYY at hh:mm',
    timezone: 'America/New_York',
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.content'],

    // Is there anything in the content you selected that needs transformed
    // before it's consumable content? E.g., unusual lazy loaded images
    transforms: {},

    // Is there anything that is in the result that shouldn't be?
    // The clean selectors will remove anything that matches from
    // the result
    clean: [],
  },
};
