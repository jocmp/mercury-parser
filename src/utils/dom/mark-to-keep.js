import parseUrl from 'utils/parse-url';

import { KEEP_SELECTORS, KEEP_CLASS } from './constants';
import findWithin from './find-within';

export default function markToKeep(article, $, url, tags = []) {
  if (tags.length === 0) {
    tags = KEEP_SELECTORS;
  }

  const parsedUrl = parseUrl(url);
  if (parsedUrl) {
    const { protocol, hostname } = parsedUrl;
    tags = [...tags, `iframe[src^="${protocol}//${hostname}"]`];
  }

  findWithin(article, tags.join(',')).addClass(KEEP_CLASS);

  return $;
}
