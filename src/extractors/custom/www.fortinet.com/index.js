export const WwwFortinetComExtractor = {
  domain: 'www.fortinet.com',

  title: {
    selectors: ['h1'],
  },

  author: {
    selectors: ['.b15-blog-meta__author'],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: [
      'div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12',
    ],

    transforms: {
      // Cheerio 1.x treats noscript content as text, not parsed HTML
      // so we need to parse it manually
      noscript: ($node, $) => {
        const noscriptHtml = $node.html();
        if (!noscriptHtml) return null;

        // Parse the noscript content to check if it's a single img
        const $parsed = $.load
          ? $.load(noscriptHtml, null, false)
          : $(`<div>${noscriptHtml}</div>`);
        const $children = $.load ? $parsed('*') : $parsed.children();

        if ($children.length === 1 && $children.get(0).tagName === 'img') {
          return 'figure';
        }
        return null;
      },
    },
  },
};
