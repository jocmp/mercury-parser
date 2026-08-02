import URL from 'url';

import { KEEP_SELECTORS, KEEP_CLASS } from './constants';
import findWithin from './find-within';

export default function markToKeep(article, $, url, tags = []) {
  if (tags.length === 0) {
    tags = KEEP_SELECTORS;
  }

  if (url) {
    const { protocol, hostname } = URL.parse(url);
    tags = [...tags, `iframe[src^="${protocol}//${hostname}"]`];
  }

  findWithin(article, tags.join(',')).addClass(KEEP_CLASS);

  return $;
}
