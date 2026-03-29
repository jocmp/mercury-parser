import type { CheerioAPI, Cheerio } from 'cheerio';
import type { AnyNode } from 'domhandler';

export type CheerioElement = Cheerio<AnyNode>;

export interface ParseResult {
  title: string | null;
  author: string | null;
  date_published: string | null;
  dek: string | null;
  lead_image_url: string | null;
  content: string | null;
  next_page_url: string | null;
  url: string;
  domain: string;
  excerpt: string | null;
  word_count: number;
  direction: string;
  total_pages?: number;
  rendered_pages?: number;
  error?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface ParseOptions {
  html?: string;
  contentType?: 'html' | 'markdown' | 'text';
  headers?: Record<string, string>;
  fetchAllPages?: boolean;
  fallback?: boolean;
  extend?: Record<string, ExtractionOpts>;
  customExtractor?: CustomExtractor;
}

export type SelectorAttrPair = [string, string];
export type SelectorAttrTransform = [string, string, (value: string) => string];
export type Selector = string | SelectorAttrPair | SelectorAttrTransform;

export interface ExtractionOpts {
  selectors: Selector[];
  defaultCleaner?: boolean;
  allowMultiple?: boolean;
  transforms?: Record<string, string | (($node: CheerioElement, $: CheerioAPI) => string | void)>;
  clean?: string[];
}

export interface CustomExtractor {
  domain: string;
  supportedDomains?: string[];
  title?: ExtractionOpts | string | null;
  author?: ExtractionOpts | string | null;
  date_published?: ExtractionOpts | string | null;
  dek?: ExtractionOpts | string | null;
  lead_image_url?: ExtractionOpts | string | null;
  content?: ExtractionOpts | null;
  next_page_url?: ExtractionOpts | null;
  excerpt?: ExtractionOpts | null;
  extend?: Record<string, ExtractionOpts>;
}

export interface GenericExtractorType {
  domain: string;
  title: (opts: ExtractorOpts) => string | null;
  date_published: (opts: ExtractorOpts) => string | null;
  author: (opts: ExtractorOpts) => string | null;
  content: (opts: ExtractorOpts) => string | null;
  lead_image_url: (opts: ExtractorOpts) => string | null;
  dek: (opts: ExtractorOpts) => string | null;
  next_page_url: (opts: ExtractorOpts) => string | null;
  url_and_domain: (opts: ExtractorOpts) => { url: string; domain: string };
  excerpt: (opts: ExtractorOpts) => string | null;
  word_count: (opts: ExtractorOpts) => number;
  direction: (opts: { title: string }) => string;
  extract: (opts: ExtractorOpts) => ParseResult;
}

export interface ExtractorOpts {
  url?: string;
  html?: string;
  $?: CheerioAPI;
  metaCache?: string[];
  parsedUrl?: URL;
  fallback?: boolean;
  contentType?: string;
  content?: string;
  title?: string;
  excerpt?: string;
  extractedTitle?: string;
  previousUrls?: string[];
  type?: string;
  extractor?: CustomExtractor | GenericExtractorType;
  extractionOpts?: ExtractionOpts | string | null;
  extractHtml?: boolean;
  defaultCleaner?: boolean;
  contentOnly?: boolean;
  [key: string]: unknown;
}

export interface FetchResult {
  body?: Buffer | string;
  response?: {
    statusMessage?: string;
    statusCode?: number;
    headers: Record<string, string | number>;
    error?: string;
  };
  alreadyDecoded?: boolean;
  error?: boolean;
  failed?: boolean;
  message?: string;
}
