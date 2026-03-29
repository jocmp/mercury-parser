import URL from 'url';

import Extractors from './all';
import GenericExtractor from './generic';
import detectByHtml from './detect-by-html';
import { apiExtractors } from './add-extractor';

export default function getExtractor(url: any, parsedUrl?: any, $?: any) {
  parsedUrl = parsedUrl || URL.parse(url);
  const { hostname } = parsedUrl;
  const baseDomain = hostname
    .split('.')
    .slice(-2)
    .join('.');

  return (
    (apiExtractors as any)[hostname] ||
    (apiExtractors as any)[baseDomain] ||
    (Extractors as any)[hostname] ||
    (Extractors as any)[baseDomain] ||
    detectByHtml($) ||
    GenericExtractor
  );
}
