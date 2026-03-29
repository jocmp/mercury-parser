export const WwwNotebookcheckNetExtractor = {
  domain: 'www.notebookcheck.net',

  title: {
    selectors: ['h1'],
  },

  author: {
    selectors: ['.intro-author a'],
  },

  date_published: {
    selectors: [['.intro-author time', 'datetime']],
    timezone: 'GMT',
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['#content'],

    transforms: {
      h2: $node => $node.attr('class', 'mercury-parser-keep'),

      h3: $node => $node.attr('class', 'mercury-parser-keep'),

      h4: $node => $node.attr('class', 'mercury-parser-keep'),
    },

    clean: ['.ttcl_3', '.socialarea', '.tx-nbc2fe-relatedarticles', 'aside'],
  },
};
