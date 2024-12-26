const http = require('http');
const Parser = require('../dist/mercury.js');

/**
 * @param {string} reqPath
 * @returns string | null
 */
async function parseFixture(reqPath) {
  const reqURL = new URL(`https://example.com${reqPath}`);
  const url = reqURL.searchParams.get('article_url');

  const json = await Parser.parse(url, { fallback: false });

  return `<h1>${json.title}</h1><img src=${
    json.lead_image_url
  } style="max-width: 100%;" /><p>By ${json.author}</p>${json.content}`;
}

const server = http.createServer(async (req, res) => {
  try {
    const html = await parseFixture(req.url);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end(e.message);
  }
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/`);
});
