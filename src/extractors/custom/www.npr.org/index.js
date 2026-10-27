export const WwwNprOrgExtractor = {
  domain: 'www.npr.org',

  title: {
    selectors: ['h1', '.storytitle'],
  },

  author: {
    selectors: ['p.byline__name.byline__name--block'],
  },

  date_published: {
    selectors: [
      ['.dateblock time[datetime]', 'datetime'],
      ['meta[name="date"]', 'value'],
    ],
  },

  lead_image_url: {
    selectors: [
      ['meta[name="og:image"]', 'value'],
      ['meta[name="twitter:image:src"]', 'value'],
    ],
  },

  content: {
    selectors: ['.storytext'],

    transforms: {
      '.bucketwrap.image': 'figure',
      '.bucketwrap.image .credit-caption': 'figcaption',

      // Brightspot's data-template replaces src during lazy-image conversion,
      // and the CDN answers its unexpanded tokens with a placeholder image.
      // Expand from data-template, since src is percent-encoded by now.
      'img[data-template]': $node => {
        const src = $node
          .attr('data-template')
          .replace(/\{width\}/g, '1200')
          .replace(/\{quality\}/g, '85')
          .replace(/\{format\}/g, $node.attr('data-format') || 'webp');
        $node.attr('src', src);
      },
    },

    clean: ['div.enlarge_measure'],
  },
};
