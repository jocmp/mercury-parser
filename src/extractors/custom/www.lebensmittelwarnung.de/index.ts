export const WwwLebensmittelwarnungDeExtractor = {
  domain: 'www.lebensmittelwarnung.de',

  title: {
    selectors: ['.lmw-intro__heading', 'title'],
  },

  date_published: {
    selectors: [['.lmw-intro__meta > time', 'datetime']],
    format: 'DD.MM.YYYY',
    timezone: 'Europe/Berlin',
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['main'],

    transforms: {
      h2: node => {
        const button = node.find('button');

        if (node.find('button').length > 0) {
          node.find('.lmw-section__toggle-icon').remove();
          node.text(button.text().trim());
        }

        node.attr('class', 'mercury-parser-keep');
      },
      ul: $node => {
        $node.attr('class', 'mercury-parser-keep');
      },
      '.lmw-bodytext': node => {
        // Kontakt Information
        node.attr('class', 'mercury-parser-keep');
      },
      '.lmw-description-list__item': node => {
        node.attr('class', 'mercury-parser-keep');
      },
    },

    clean: [],
  },
};
