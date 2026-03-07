export const WwwMediaoneonlineComExtractor = {
  domain: 'www.mediaoneonline.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [['meta[name="author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  dek: {
    selectors: ['h2.article-description'],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.hb-entry-main-content', '.story_content'],
    clean: ['.inside-post-ad-1', '.inside-post-ad-before', '.inside-post-ad-before-before', '.inside-post-ad-after', '.hocal-draggable', '.audioSection'],
  },
};
