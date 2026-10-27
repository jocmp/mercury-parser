import resolveUrl from 'utils/resolve-url';

const MEDIA = 'img, picture, video, audio, iframe, svg, embed, object';

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

    // .KonaBody is only the article, and its encyclopedia links push the
    // body past the conditional cleaner's link density limit.
    defaultCleaner: false,

    transforms: {
      // Images are lazy-loaded: real URL in data-src, a spacer.gif in src.
      // Links are made absolute before transforms run, so resolve it here.
      img: $node => {
        const dataSrc = $node.attr('data-src');
        if (dataSrc) {
          $node.attr(
            'src',
            resolveUrl(dataSrc, 'https://www.animenewsnetwork.com/')
          );
          $node.removeAttr('data-src');
        }
      },

      // Reviews lay out the cover, synopsis, and body in decorative tables
      'table.layout': unwrapLayoutTable,
    },

    clean: [
      'instaread-player',
      // Hidden duplicate of #small-synopsis
      '#big-synopsis',
      // Episode rating widgets and episode navigation
      'div:has(> h3 .star_rating)',
      'p:has(.star_rating)',
      'div:has(> p > select.js-content)',
    ],
  },
};

function unwrapLayoutTable($table, $) {
  const table = $table.get(0);
  const $content = $('<div></div>');

  $table
    .find('td')
    .filter((_, cell) => $(cell).closest('table').get(0) === table)
    .each((_, cell) => {
      const $cell = $(cell);
      if ($cell.hasClass('horizontal')) {
        const label = $cell.text().trim();
        if (label) {
          const $label = $('<p><strong></strong></p>');
          $label.find('strong').text(label);
          $content.append($label);
        }
      } else if ($cell.text().trim() || $cell.find(MEDIA).length) {
        $content.append($cell.contents());
      }
    });

  $table.replaceWith($content);
}
