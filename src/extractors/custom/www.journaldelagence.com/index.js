export const WwwJournaldelagenceComExtractor = {
  domain: 'www.journaldelagence.com',

  title: {
    selectors: ['h1.full-article-ttl'],
  },

  author: null,

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['#js-readspeaker'],
  },
};
