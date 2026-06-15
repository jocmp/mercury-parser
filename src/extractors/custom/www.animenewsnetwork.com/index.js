export const WwwAnimenewsnetworkComExtractor = {
  domain: 'www.animenewsnetwork.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: null,

  date_published: {
    selectors: [['small time', 'datetime']],
  },

  dek: {
    selectors: [['meta[name="description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.KonaBody'],

    transforms: {
      // Images are lazy-loaded: real URL in data-src, a spacer.gif in src.
      // Promote data-src so the images survive cleaning and render.
      img: node => {
        const dataSrc = node.attr('data-src');
        if (dataSrc) {
          const src = dataSrc.startsWith('/')
            ? `https://www.animenewsnetwork.com${dataSrc}`
            : dataSrc;
          node.attr('src', src);
          node.removeAttr('data-src');
        }
      },
    },

    // .intro duplicates the dek; instaread-player is an audio widget.
    clean: ['.intro', 'instaread-player'],
  },
};
