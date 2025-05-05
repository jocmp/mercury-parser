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
    selectors: ['#zephr-anchor', 'article'],

    transforms: {
      h2: $node => $node.attr('class', 'mercury-parser-keep'),

      h3: $node => $node.attr('class', 'mercury-parser-keep'),

      h4: $node => $node.attr('class', 'mercury-parser-keep'),

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

    clean: [],
  },
};
