const http = require('http');
const fs = require('fs');
const Parser = require('../dist/mercury.js');

function followPath(path) {
  const rootPath = `fixtures/${path}`;
  const isDirectory = fs.lstatSync(rootPath).isDirectory();

  if (isDirectory) {
    return `${rootPath}/${fs.readdirSync(rootPath)[0]}`;
  }

  return rootPath;
}

/**
 * @param {string} reqPath
 * @returns string | null
 */
async function parseFixture(reqPath) {
  const reqURL = new URL(`https://example.com${reqPath}`);
  const fixturePath = reqURL.pathname;
  const url = reqURL.searchParams.get('article_url');

  const html = fs.readFileSync(followPath(fixturePath)).toString();

  const json = await Parser.parse(url, { html, fallback: false });

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
