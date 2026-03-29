const merge = (extractor: any, domains: string[]) =>
  domains.reduce((acc: Record<string, any>, domain: string) => {
    acc[domain] = extractor;
    return acc;
  }, {});

export default function mergeSupportedDomains(extractor: any) {
  return extractor.supportedDomains
    ? merge(extractor, [extractor.domain, ...extractor.supportedDomains])
    : merge(extractor, [extractor.domain]);
}
