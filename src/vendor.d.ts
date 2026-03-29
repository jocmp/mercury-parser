declare module 'postman-request' {
  interface RequestOptions {
    url: string;
    headers?: Record<string, string>;
    timeout?: number;
    jar?: boolean;
    encoding?: null;
    gzip?: boolean;
    followAllRedirects?: boolean;
    followRedirect?: boolean;
  }

  interface Response {
    statusMessage?: string;
    statusCode?: number;
    headers: Record<string, string | number>;
    error?: string;
  }

  type Callback = (
    err: Error | null,
    response: Response,
    body: Buffer | string
  ) => void;

  function request(options: RequestOptions, callback: Callback): void;
  export = request;
}

declare module 'browser-request' {
  const request: (
    options: Record<string, unknown>,
    callback: (err: Error | null, response: unknown, body: unknown) => void
  ) => void;
  export default request;
}

declare module 'string-direction' {
  const stringDirection: {
    getDirection(text: string): string;
  };
  export default stringDirection;
}

declare module 'ellipsize' {
  function ellipsize(
    text: string,
    maxLength: number,
    options?: { ellipse?: string }
  ): string;
  export default ellipsize;
}

declare module 'wuzzy' {
  export function japianese(a: string, b: string): number;
  export function jaccard(a: string, b: string): number;
  export function jaro(a: string, b: string): number;
  export function levenshtein(a: string, b: string): number;
  export function tanimoto(a: string, b: string): number;
}

declare module 'difflib' {
  export class SequenceMatcher {
    constructor(fn: null, a: string, b: string);
    ratio(): number;
  }
}
