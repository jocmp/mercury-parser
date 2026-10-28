const PLATFORM_LABEL = /^(X|Facebook|Instagram|TikTok|YouTube)$/i;

export const WwwRosaGrExtractor = {
  domain: 'www.rosa.gr',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: [['meta[name="author"]', 'value']],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: [['#hero .post-image', '#post .post-text'], '#post .post-text'],

    transforms: {
      // The hero image is a direct child; related-post thumbnails are wrapped in links.
      '.post-image:has(> img)': 'figure',
      '.post-image .image-credits': $node => {
        // Embed credits are often just the source platform's name.
        if (PLATFORM_LABEL.test($node.text().trim())) {
          $node.remove();
          return null;
        }

        return 'figcaption';
      },
    },

    clean: ['.short-read-also'],
  },
};
