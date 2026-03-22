export const WwwTransfermarktDeExtractor = {
  domain: 'www.transfermarkt.de',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: null,

  date_published: {
    selectors: ['.news-header span:first-child'],
    format: 'DD.MM.YYYY - HH:mm',
    timezone: 'Europe/Berlin',
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.news-content'],
    defaultCleaner: false,
    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },
    clean: [
      '.dachzeile',
      '.news-header-social',
      '.newsansicht-bildquelle',
      '.news-widget--container',
      '.pinpoll',
      '.advertisment-button-container',
      'tm-consent',
    ],
  },
};
