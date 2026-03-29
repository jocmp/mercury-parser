export const WwwPolygonComExtractor = {
  domain: 'www.polygon.com',

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
    selectors: ['article'],

    transforms: {
      h2: $node => $node.attr('class', 'mercury-parser-keep'),

      h3: $node => $node.attr('class', 'mercury-parser-keep'),

      img: $node => {
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
      'cite',
      '.duet--ad--native-ad-rail',
      '.duet--layout--rail',
      '.duet--article--table-of-contents',
    ],
  },
};
