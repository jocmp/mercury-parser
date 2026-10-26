export const IS_LINK = new RegExp('https?://', 'i');
const IMAGE_RE = '.(png|gif|jpe?g)';
export const IS_IMAGE = new RegExp(`${IMAGE_RE}`, 'i');
// Unexpanded URL templates, e.g. Brightspot's `data-template` with
// `/resize/{width}/quality/{quality}/`, which the CDN answers with a placeholder.
export const IS_URL_TEMPLATE = /\{\w+\}/;
// A srcset descriptor is always whitespace-separated, so requiring `\s+` (not
// `\s*`) removes the overlap between the greedy `\S+` query and the `[\d.]+`
// descriptor that made this O(n^2) on long numeric query strings.
export const IS_SRCSET = new RegExp(
  `${IMAGE_RE}(\\?\\S+)?(\\s+[\\d.]+[wx])`,
  'i'
);

export const TAGS_TO_REMOVE = ['script', 'style', 'form'].join(',');
