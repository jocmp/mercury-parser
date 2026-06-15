export const ActualidadRtComExtractor = {
  domain: 'actualidad.rt.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [['meta[name="article:author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="mediator_published_time"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.ArticleView-text'],

    transforms: {},

    // RT wraps each <img> in a <picture> whose <source> elements carry a
    // base64 placeholder srcset; browsers honor that over the real <img src>,
    // so drop the sources and let the <img> (real URL) render.
    clean: ['.ReadMore-root', 'source'],
  },
};
