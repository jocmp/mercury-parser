import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import nock from 'nock';
import { createServer } from './mcp';
import Parser from './src/mercury';
import packageInfo from './package.json';

function request(id, method, params) {
  return { jsonrpc: '2.0', id, method, params };
}

function callTool(server, args, name = 'parse_article') {
  return server.handle(request(1, 'tools/call', { name, arguments: args }));
}

function fakeParser(result) {
  return { parse: vi.fn().mockResolvedValue(result) };
}

describe('MCP server', () => {
  describe('initialize', () => {
    it('echoes a supported protocol version', async () => {
      const server = createServer(fakeParser({}));

      const response = await server.handle(
        request(1, 'initialize', { protocolVersion: '2025-06-18' })
      );

      expect(response).toEqual({
        jsonrpc: '2.0',
        id: 1,
        result: {
          protocolVersion: '2025-06-18',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'mercury-parser',
            title: 'Mercury Parser',
            version: packageInfo.version,
          },
        },
      });
    });

    it('offers its latest version for an unknown protocol version', async () => {
      const server = createServer(fakeParser({}));

      const response = await server.handle(
        request(1, 'initialize', { protocolVersion: '1999-01-01' })
      );

      expect(response.result.protocolVersion).toBe('2025-11-25');
    });
  });

  it('answers ping', async () => {
    const server = createServer(fakeParser({}));

    const response = await server.handle(request(7, 'ping'));

    expect(response).toEqual({ jsonrpc: '2.0', id: 7, result: {} });
  });

  it('does not respond to notifications', async () => {
    const server = createServer(fakeParser({}));

    const response = await server.handle({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
    });

    expect(response).toBeNull();
  });

  it('rejects unknown methods', async () => {
    const server = createServer(fakeParser({}));

    const response = await server.handle(request(2, 'resources/list'));

    expect(response.error.code).toBe(-32601);
  });

  it('rejects malformed requests', async () => {
    const server = createServer(fakeParser({}));

    const response = await server.handle({ id: 3, method: 'ping' });

    expect(response.error.code).toBe(-32600);
  });

  it('reports invalid JSON as a parse error', async () => {
    const server = createServer(fakeParser({}));

    const response = await server.handleLine('{not json');

    expect(response).toEqual({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error' },
    });
  });

  it('lists the parse_article tool', async () => {
    const server = createServer(fakeParser({}));

    const response = await server.handle(request(1, 'tools/list'));
    const [tool] = response.result.tools;

    expect(response.result.tools).toHaveLength(1);
    expect(tool.name).toBe('parse_article');
    expect(tool.inputSchema.required).toEqual(['url']);
  });

  describe('tools/call parse_article', () => {
    it('passes format and headers to the parser', async () => {
      const parser = fakeParser({ title: 'Hello', content: 'Body' });
      const server = createServer(parser);

      await callTool(server, {
        url: 'https://example.com/post',
        format: 'text',
        headers: { Cookie: 'a=b' },
      });

      expect(parser.parse).toHaveBeenCalledWith('https://example.com/post', {
        contentType: 'text',
        headers: { Cookie: 'a=b' },
      });
    });

    it('defaults to markdown', async () => {
      const parser = fakeParser({ content: 'Body' });
      const server = createServer(parser);

      await callTool(server, { url: 'https://example.com/post' });

      expect(parser.parse).toHaveBeenCalledWith('https://example.com/post', {
        contentType: 'markdown',
        headers: {},
      });
    });

    it('returns metadata followed by content', async () => {
      const server = createServer(
        fakeParser({
          title: 'Hello',
          author: 'Jane Doe',
          date_published: null,
          url: 'https://example.com/post',
          content: '# Body',
        })
      );

      const response = await callTool(server, {
        url: 'https://example.com/post',
      });

      expect(response.result).toEqual({
        content: [
          {
            type: 'text',
            text: 'Title: Hello\nAuthor: Jane Doe\nURL: https://example.com/post\n\n# Body',
          },
        ],
      });
    });

    it('returns parser errors as tool errors', async () => {
      const server = createServer(
        fakeParser({ error: true, message: 'Resource returned a 404' })
      );

      const response = await callTool(server, {
        url: 'https://example.com/missing',
      });

      expect(response.result).toEqual({
        content: [{ type: 'text', text: 'Resource returned a 404' }],
        isError: true,
      });
    });

    it('returns thrown errors as tool errors', async () => {
      const server = createServer({
        parse: vi.fn().mockRejectedValue(new Error('socket hang up')),
      });

      const response = await callTool(server, {
        url: 'https://example.com/post',
      });

      expect(response.result.isError).toBe(true);
      expect(response.result.content[0].text).toBe(
        'Failed to parse https://example.com/post: socket hang up'
      );
    });

    it('treats empty content as a tool error', async () => {
      const server = createServer(fakeParser({ title: 'Hi', content: '  ' }));

      const response = await callTool(server, {
        url: 'https://example.com/app',
      });

      expect(response.result.isError).toBe(true);
      expect(response.result.content[0].text).toBe(
        'No article content found at https://example.com/app'
      );
    });

    it('rejects a missing url', async () => {
      const server = createServer(fakeParser({}));

      const response = await callTool(server, {});

      expect(response.error.code).toBe(-32602);
    });

    it('rejects an unsupported format', async () => {
      const server = createServer(fakeParser({}));

      const response = await callTool(server, {
        url: 'https://example.com',
        format: 'pdf',
      });

      expect(response.error.code).toBe(-32602);
    });

    it('rejects unknown tools', async () => {
      const server = createServer(fakeParser({}));

      const response = await callTool(server, {}, 'delete_everything');

      expect(response.error.code).toBe(-32602);
    });
  });

  describe('with the real parser', () => {
    const url =
      'https://arstechnica.com/science/2025/02/twenty-two-states-sue-to-block-new-nih-funding-policy/';
    const html = fs.readFileSync(
      path.join(__dirname, 'fixtures/arstechnica.com/1739238328741.html'),
      'utf8'
    );

    beforeAll(() => nock.disableNetConnect());
    afterAll(() => {
      nock.cleanAll();
      nock.enableNetConnect();
    });

    it('fetches and extracts an article as markdown', async () => {
      nock('https://arstechnica.com')
        .get(new URL(url).pathname)
        .reply(200, html, { 'Content-Type': 'text/html; charset=utf-8' });
      const server = createServer(Parser);

      const response = await callTool(server, { url });
      const [{ text }] = response.result.content;

      expect(response.result.isError).toBeUndefined();
      expect(text).toMatch(/^Title: .*NIH/);
      expect(text).toContain(`URL: ${url}`);
      expect(text).not.toMatch(/<p>/);
    });
  });

  describe('over stdio', () => {
    it('speaks newline-delimited JSON-RPC', async () => {
      const child = spawn(process.execPath, [path.join(__dirname, 'mcp.js')]);
      const lines = readline.createInterface({ input: child.stdout });
      const responses = [];
      const received = new Promise(resolve => {
        lines.on('line', line => {
          responses.push(JSON.parse(line));
          if (responses.length === 3) {
            resolve();
          }
        });
      });

      const messages = [
        request(1, 'initialize', { protocolVersion: '2025-06-18' }),
        { jsonrpc: '2.0', method: 'notifications/initialized' },
        request(2, 'tools/list'),
      ];
      messages.forEach(message =>
        child.stdin.write(`${JSON.stringify(message)}\n`)
      );
      child.stdin.write('{oops\n');

      await received;
      child.kill();

      const byId = Object.fromEntries(responses.map(r => [r.id, r]));
      expect(byId[1].result.serverInfo.name).toBe('mercury-parser');
      expect(byId[2].result.tools[0].name).toBe('parse_article');
      expect(byId[null].error.code).toBe(-32700);
    });
  });
});
