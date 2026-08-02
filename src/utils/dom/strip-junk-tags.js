import { STRIP_OUTPUT_TAGS, KEEP_CLASS } from './constants';
import findWithin from './find-within';

export default function stripJunkTags(article, $, tags = []) {
  if (tags.length === 0) {
    tags = STRIP_OUTPUT_TAGS;
  }

  // Remove matching elements, but ignore
  // any element with a class of mercury-parser-keep
  findWithin(article, tags.join(',')).not(`.${KEEP_CLASS}`).remove();

  return $;
}
