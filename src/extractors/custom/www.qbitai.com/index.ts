export const WwwQbitaiComExtractor = {
  domain: 'www.qbitai.com',

  title: {
    selectors: ['title', 'h1'],
  },

  content: {
    selectors: ['.article'],

    transforms: {
      '.zhaiyao': (node: any) => node.attr('class', 'mercury-parser-keep'),
    },

    clean: ['.article_info'],
  },
};
