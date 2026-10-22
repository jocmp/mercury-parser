#!/usr/bin/env node

const readline = require('readline');
const packageInfo = require('./package.json');

const SUPPORTED_PROTOCOL_VERSIONS = [
  '2025-11-25',
  '2025-06-18',
  '2025-03-26',
  '2024-11-05',
];

const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;
const INTERNAL_ERROR = -32603;

const CONTENT_TYPES = ['markdown', 'html', 'text'];

const PARSE_ARTICLE_TOOL = {
  name: 'parse_article',
  title: 'Parse article',
  description:
    'Fetch a web page and extract its main article content and metadata (title, author, publish date, lead image). Uses site-specific extractors when available and follows multi-page articles.',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'Absolute http(s) URL of the article',
      },
      format: {
        type: 'string',
        enum: CONTENT_TYPES,
        default: 'markdown',
        description: 'Format of the returned article content',
      },
      headers: {
        type: 'object',
        additionalProperties: { type: 'string' },
        description: 'Extra request headers, such as Cookie or User-Agent',
      },
    },
    required: ['url'],
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
};

const METADATA_LABELS = [
  ['title', 'Title'],
  ['author', 'Author'],
  ['date_published', 'Published'],
  ['url', 'URL'],
  ['lead_image_url', 'Lead image'],
  ['word_count', 'Word count'],
];

class InvalidParamsError extends Error {}

function negotiateProtocolVersion(requested) {
  if (SUPPORTED_PROTOCOL_VERSIONS.includes(requested)) {
    return requested;
  }
  return SUPPORTED_PROTOCOL_VERSIONS[0];
}

function formatArticle(result) {
  const metadata = METADATA_LABELS.filter(([key]) => result[key] != null).map(
    ([key, label]) => `${label}: ${result[key]}`
  );

  return `${metadata.join('\n')}\n\n${result.content}`;
}

function toolError(message) {
  return { content: [{ type: 'text', text: message }], isError: true };
}

function parseArticleArguments(args = {}) {
  const { url, format = 'markdown', headers = {} } = args;

  if (typeof url !== 'string' || url.length === 0) {
    throw new InvalidParamsError('url must be a non-empty string');
  }
  if (!CONTENT_TYPES.includes(format)) {
    throw new InvalidParamsError(
      `format must be one of ${CONTENT_TYPES.join(', ')}`
    );
  }
  if (typeof headers !== 'object' || headers === null) {
    throw new InvalidParamsError('headers must be an object');
  }

  return { url, format, headers };
}

async function parseArticle(parser, args) {
  const { url, format, headers } = parseArticleArguments(args);

  let result;
  try {
    result = await parser.parse(url, { contentType: format, headers });
  } catch (error) {
    return toolError(`Failed to parse ${url}: ${error.message}`);
  }

  if (result.error) {
    return toolError(result.message);
  }
  if (!result.content || result.content.trim().length === 0) {
    return toolError(`No article content found at ${url}`);
  }

  return { content: [{ type: 'text', text: formatArticle(result) }] };
}

function createServer(parser) {
  const methods = {
    initialize: params => ({
      protocolVersion: negotiateProtocolVersion(params.protocolVersion),
      capabilities: { tools: {} },
      serverInfo: {
        name: 'mercury-parser',
        title: 'Mercury Parser',
        version: packageInfo.version,
      },
    }),
    ping: () => ({}),
    'tools/list': () => ({ tools: [PARSE_ARTICLE_TOOL] }),
    'tools/call': params => {
      if (params.name !== PARSE_ARTICLE_TOOL.name) {
        throw new InvalidParamsError(`Unknown tool: ${params.name}`);
      }
      return parseArticle(parser, params.arguments);
    },
  };

  async function handle(message) {
    if (
      message === null ||
      typeof message !== 'object' ||
      message.jsonrpc !== '2.0' ||
      typeof message.method !== 'string'
    ) {
      if (message && message.id !== undefined) {
        return errorResponse(message.id, INVALID_REQUEST, 'Invalid request');
      }
      return null;
    }

    const { id, method, params = {} } = message;
    const isNotification = id === undefined;

    if (isNotification) {
      return null;
    }

    const handler = methods[method];
    if (!handler) {
      return errorResponse(id, METHOD_NOT_FOUND, `Method not found: ${method}`);
    }

    try {
      const result = await handler(params);
      return { jsonrpc: '2.0', id, result };
    } catch (error) {
      if (error instanceof InvalidParamsError) {
        return errorResponse(id, INVALID_PARAMS, error.message);
      }
      return errorResponse(id, INTERNAL_ERROR, error.message);
    }
  }

  async function handleLine(line) {
    if (line.trim().length === 0) {
      return null;
    }

    let message;
    try {
      message = JSON.parse(line);
    } catch {
      return errorResponse(null, PARSE_ERROR, 'Parse error');
    }

    return handle(message);
  }

  return { handle, handleLine };
}

function errorResponse(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function run(parser, input = process.stdin, output = process.stdout) {
  const server = createServer(parser);
  const lines = readline.createInterface({ input });

  console.log = console.error;
  console.info = console.error;

  lines.on('line', async line => {
    const response = await server.handleLine(line);
    if (response) {
      output.write(`${JSON.stringify(response)}\n`);
    }
  });
}

if (require.main === module) {
  run(require('./dist/mercury'));
}

module.exports = { createServer, run };
