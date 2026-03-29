export const BalloonJuiceComExtractor = {
  domain: 'balloon-juice.com',

  title: {
    selectors: ['h1.entry-title'],
  },

  author: {
    selectors: ['.entry-author-name'],
  },

  date_published: {
    selectors: [
      ['meta[property="article:published_time"]', 'content'],
      ['meta[name="article:published_time"]', 'value'],
    ],
  },

  lead_image_url: {
    selectors: [
      ['meta[property="og:image"]', 'content'],
      ['meta[name="og:image"]', 'value'],
    ],
  },

  content: {
    selectors: ['.entry-content', 'article'],
    transforms: {
      // Handle JS-rendered iframes
      'iframe[src*="embed.bsky.app"]': $node => {
        $node.addClass('mercury-parser-keep iframe-embed-bsky');
        $node.parent('.bluesky-embed').addClass('mercury-parser-keep');
      },
      // Handle no-JS blockquote fallbacks - convert to iframes
      'blockquote.bluesky-embed[data-bluesky-uri]': ($node, $) => {
        const uri = $node.attr('data-bluesky-uri');
        if (uri) {
          // Convert at://did:plc:.../app.bsky.feed.post/... to embed URL
          const embedPath = uri.replace('at://', '');
          const src = `https://embed.bsky.app/embed/${embedPath}`;
          const $iframe = $(
            `<iframe src="${src}" class="mercury-parser-keep iframe-embed-bsky" width="100%" frameborder="0"></iframe>`
          );
          $node.replaceWith($iframe);
        }
      },
    },
    clean: ['.shared-counts-wrap', '.entry-meta'],
  },
};
