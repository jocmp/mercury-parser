import { extractFromMeta } from 'utils/dom';
import parseUrl from 'utils/parse-url';

import { CANONICAL_META_SELECTORS } from './constants';

function parseDomain(url) {
  const parsedUrl = parseUrl(url);
  if (!parsedUrl) return null;

  return parsedUrl.hostname;
}

function result(url) {
  return {
    url,
    domain: parseDomain(url),
  };
}

const GenericUrlExtractor = {
  extract({ $, url, metaCache }) {
    const $canonical = $('link[rel=canonical]');
    if ($canonical.length !== 0) {
      const href = $canonical.attr('href');
      if (href) {
        return result(href);
      }
    }

    const metaUrl = extractFromMeta($, CANONICAL_META_SELECTORS, metaCache);
    if (metaUrl) {
      return result(metaUrl);
    }

    return result(url);
  },
};

export default GenericUrlExtractor;
