export const WwwAndroidauthorityComExtractor = {
  domain: 'www.androidauthority.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.d_Od button'],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  dek: {
    selectors: ['.d__d'],
  },

  lead_image_url: {
    selectors: [['.d_1r img', 'src']],
  },

  content: {
    selectors: ['.d_7d', '.d_6d'],
    transforms: {
      'div.d_Hk': node => {
        node.attr('class', 'mercury-parser-keep');
      },
      'div.d_Hk + ul': node => {
        node.attr('class', 'mercury-parser-keep');
      },
    },
    clean: ['.d_Xo', 'div.d_Vp'],
  },
};
