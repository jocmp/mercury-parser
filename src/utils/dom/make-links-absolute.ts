import URL from 'url';

import getAttrs from './get-attrs';
import setAttr from './set-attr';

function absolutize($: any, rootUrl: string, attr: string) {
  const baseUrl = $('base').attr('href');

  $(`[${attr}]`).each((_: number, node: any) => {
    const attrs = getAttrs(node);
    const url = attrs[attr];
    if (!url) return;
    const absoluteUrl = URL.resolve(baseUrl || rootUrl, url);

    setAttr(node, attr, absoluteUrl);
  });
}

function absolutizeSet($: any, rootUrl: string, $content: any) {
  $('[srcset]', $content).each((_: number, node: any) => {
    const attrs = getAttrs(node);
    const urlSet = attrs.srcset;

    if (urlSet) {
      // a comma should be considered part of the candidate URL unless preceded by a descriptor
      // descriptors can only contain positive numbers followed immediately by either 'w' or 'x'
      // space characters inside the URL should be encoded (%20 or +)
      const candidates = urlSet.match(
        /(?:\s*)(\S+(?:\s*[\d.]+[wx])?)(?:\s*,\s*)?/g
      );
      if (!candidates) return;
      const absoluteCandidates = candidates.map((candidate: string) => {
        // a candidate URL cannot start or end with a comma
        // descriptors are separated from the URLs by unescaped whitespace
        const parts = candidate
          .trim()
          .replace(/,$/, '')
          .split(/\s+/);
        parts[0] = URL.resolve(rootUrl, parts[0]);
        return parts.join(' ');
      });
      const absoluteUrlSet = [...new Set(absoluteCandidates)].join(', ');
      setAttr(node, 'srcset', absoluteUrlSet);
    }
  });
}

export default function makeLinksAbsolute($content: any, $: any, url: string) {
  ['href', 'src'].forEach(attr => absolutize($, url, attr));
  absolutizeSet($, url, $content);

  return $content;
}
