export const TerminaltroveComExtractor = {
  domain: 'terminaltrove.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  dek: {
    selectors: [['meta[name="og:description"]', 'value']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['main'],
    clean: [
      '.share-badge',
      '.modal',
      '.modal-toggle',
      '.sr-only',
      '.premium-sponsor-featured',
    ],
  },
};
