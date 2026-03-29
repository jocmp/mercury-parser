import mergeSupportedDomains from '../utils/merge-supported-domains';

export const apiExtractors = {};

export default function addExtractor(extractor?: any): any {
  if (!extractor || !extractor.domain) {
    return {
      error: true,
      message: 'Unable to add custom extractor. Invalid parameters.',
    };
  }

  Object.assign(apiExtractors, mergeSupportedDomains(extractor));

  return apiExtractors;
}
