function removeAffiliateLink(node) {
  if (
    node
      .text()
      .startsWith(
        'Affiliate links on Android Authority may earn us a commission.'
      )
  ) {
    node.remove();
  }
}

function removePolls(node) {
  const siblings = node.parent().children();

  if (siblings.find('button:not(:has(picture))').length > 0) {
    node.parent().remove();

    return true;
  }

  return false;
}

export const WwwAndroidauthorityComExtractor = {
  domain: 'www.androidauthority.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value'], 'h1'],
  },

  author: {
    selectors: ['button.d_ic'],
  },

  date_published: {
    selectors: [['meta[name="article:published_time"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  // Some pages have a nested header elements that are significant, and that the parser will
  // remove if not following a paragraph. Adding this empty paragraph fixes it, and
  // the empty paragraph will be removed anyway.
  content: {
    selectors: ['main'],
    transforms: {
      div: node => {
        removeAffiliateLink(node);
      },
      p: node => {
        if (node.text().startsWith('Published on')) {
          node.remove();
        }

        removeAffiliateLink(node);
      },
      ol: node => {
        node.attr('class', 'mercury-parser-keep');
      },
      h2: $node => $node.attr('class', 'mercury-parser-keep'),
      h3: node => {
        if (!removePolls(node)) {
          node.attr('class', 'mercury-parser-keep');
        }
      },
    },
    clean: [
      'h1 + div', // Dek
      'picture + div', // Lead image text
    ],
  },
};
