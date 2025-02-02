export const TldrTechExtractor = {
  domain: 'tldr.tech',

  title: {
    selectors: ['h1'],
  },

  lead_image_url: {
    selectors: [['meta[name="twitter:image"]', 'value']],
  },

  content: {
    selectors: ['.content-center', 'body'],

    transforms: {
      h2: $node => $node.attr('class', 'mercury-parser-keep'),
      h3: $node => $node.attr('class', 'mercury-parser-keep'),
    },

    clean: [],
  },
};
