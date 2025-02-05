export const WwwSePlExtractor = {
  domain: 'www.se.pl',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.article_author:first-of-type'],
  },

  date_published: {
    selectors: ['#timezone'],
    timezone: 'Europe/Warsaw',
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['article'],

    transforms: {},

    clean: [
      '.article__author__croppimg', // author photo
      '.related_articles__elements',
      '.gl_plugin.socials',
      '.gl_plugin.player',
      '.gl_plugin.video_player',
      '.gl_plugin + video',
    ],
  },
};
