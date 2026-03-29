export const WwwThevergeComExtractor = {
  domain: 'www.theverge.com',

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
    selectors: ['.duet--layout--entry-body', 'article'],

    transforms: {
      h2: ($node: any) => $node.attr('class', 'mercury-parser-keep'),

      h3: ($node: any) => $node.attr('class', 'mercury-parser-keep'),

      h4: ($node: any) => $node.attr('class', 'mercury-parser-keep'),

      img: ($node: any) => {
        const srcset = $node.attr('srcset');
        const [src] = (srcset || '').split(',');

        if (src) {
          $node
            .parent()
            .replaceWith(
              `<figure><img srcset="${srcset}" src="${src}"/></figure>`
            );
        }
      },
    },

    clean: [
      '.duet--article--timestamp',
      '[id*="-article_footer"]',
      '[id*="-article_footer"] ~ *',
      '#comments',
      '#comments ~ *',
    ],
  },
};
