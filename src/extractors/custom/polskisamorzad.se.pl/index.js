export const PolskisamorzadSePlExtractor = {
  domain: 'polskisamorzad.se.pl',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [
      '.article_author:first-of-type',
      '.article-author',
      ['meta[name="og:article:author"]', 'value'],
    ],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.article-single'],

    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },

    clean: [
      '#timezone',
      '.author',
      '.article__author__croppimg',
      '.article_authors_with_thumbnail',
      '.related_articles__elements',
      '.gl_plugin.socials',
      '.gl_plugin.player',
      '.gl_plugin.video_player',
      '.gl_plugin + video',
    ],
  },
};
