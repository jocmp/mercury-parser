export const BskyAppExtractor = {
  domain: 'bsky.app',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: null,

  date_published: null,

  lead_image_url: {
    selectors: [
      ['meta[property="og:image"]', 'content'],
      ['meta[name="og:image"]', 'value'],
    ],
  },

  content: {
    selectors: ['noscript'],

    transforms: {
      noscript: ($node, $) => {
        const innerHtml = $.browser ? $node.text() : $node.html();
        const summary = $(innerHtml).find('#bsky_post_text');
        $node.replaceWith(summary.html());
      },
    },

    clean: [],
  },
};
