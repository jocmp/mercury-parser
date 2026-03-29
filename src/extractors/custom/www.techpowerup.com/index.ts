export const WwwTechpowerupComExtractor = {
  domain: 'www.techpowerup.com',

  title: {
    selectors: [['meta[name="og:title"]', 'value']],
  },

  author: {
    selectors: ['.byline address'],
  },

  date_published: {
    selectors: [['.byline time[datetime]', 'datetime']],
  },

  lead_image_url: {
    selectors: [['meta[name="og:image"]', 'value']],
  },

  content: {
    selectors: ['.contnt'],

    transforms: {
      h2: node => node.attr('class', 'mercury-parser-keep'),
    },

    clean: ['header', 'footer'],
  },

  next_page_url: {
    selectors: [['.nextpage-bottom', 'href']],
  },
};
