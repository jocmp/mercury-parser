declare module 'mercury' {
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
    total_pages: number;
    rendered_pages: number;
    error?: boolean;
    message?: string;
  }

  export interface ParseOptions {
    html?: string;
    contentType?: string;
    headers?: Record<string, string>;
    fetchAllPages?: boolean;
  }

  export interface Mercury {
    parse(url: string, options?: ParseOptions): Promise<ParseResult>;
    browser?: boolean;
  }

  const Mercury: Mercury;
  export default Mercury;
}
