# Mercury Parser - Extracting content from chaos

<a href="https://www.npmjs.com/package/@jocmp/mercury-parser">
  <img src="https://img.shields.io/npm/v/@jocmp/mercury-parser.svg" alt="npm version">
</a>
<a href="https://github.com/jocmp/mercury-parser/actions/workflows/ci.yml">
  <img src="https://github.com/jocmp/mercury-parser/actions/workflows/ci.yml/badge.svg" alt="CI">
</a>

Mercury Parser extracts the bits that humans care about from any URL you give it. That includes article content, titles, authors, published dates, excerpts, lead images, and more.

Mercury Parser allows you to easily create custom parsers using simple JavaScript and CSS selectors. This allows you to proactively manage parsing and migration edge cases. There are [many examples available](https://github.com/jocmp/mercury-parser/tree/master/src/extractors/custom) along with [documentation](https://github.com/jocmp/mercury-parser/blob/master/src/extractors/custom/README.md).

## How? Like this.

### Installation

```bash
# If you're using yarn
yarn add @jocmp/mercury-parser

# If you're using npm
npm install @jocmp/mercury-parser
```

### Usage

```javascript
import Parser from '@jocmp/mercury-parser';

Parser.parse(url).then(result => console.log(result));

// NOTE: When used in the browser, you can omit the URL argument
// and simply run `Parser.parse()` to parse the current page.
```

The result looks like this:

```json
{
  "title": "Thunder (mascot)",
  "content": "... <p><b>Thunder</b> is the <a href=\"https://en.wikipedia.org/wiki/Stage_name\">stage name</a> for the...",
  "author": "Wikipedia Contributors",
  "date_published": "2016-09-16T20:56:00.000Z",
  "lead_image_url": null,
  "dek": null,
  "next_page_url": null,
  "url": "https://en.wikipedia.org/wiki/Thunder_(mascot)",
  "domain": "en.wikipedia.org",
  "excerpt": "Thunder Thunder is the stage name for the horse who is the official live animal mascot for the Denver Broncos",
  "word_count": 4677,
  "direction": "ltr",
  "total_pages": 1,
  "rendered_pages": 1
}
```

If Parser is unable to find a field, that field will return `null`.

#### `parse()` Options

##### Content Formats

By default, Mercury Parser returns the `content` field as HTML. However, you can override this behavior by passing in options to the `parse` function, specifying whether or not to scrape all pages of an article, and what type of output to return (valid values are `'html'`, `'markdown'`, and `'text'`). For example:

```javascript
Parser.parse(url, { contentType: 'markdown' }).then(result =>
  console.log(result)
);
```

This returns the the page's `content` as GitHub-flavored Markdown:

```json
"content": "...**Thunder** is the [stage name](https://en.wikipedia.org/wiki/Stage_name) for the..."
```

##### Custom Request Headers

You can include custom headers in requests by passing name-value pairs to the `parse` function as follows:

```javascript
Parser.parse(url, {
  headers: {
    Cookie: 'name=value; name2=value2; name3=value3',
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
  },
}).then(result => console.log(result));
```

##### Pre-fetched HTML

You can use Mercury Parser to parse custom or pre-fetched HTML by passing an HTML string to the `parse` function as follows:

```javascript
Parser.parse(url, {
  html:
    '<html><body><article><h1>Thunder (mascot)</h1><p>Thunder is the stage name for the horse who is the official live animal mascot for the Denver Broncos</p></article></body></html>',
}).then(result => console.log(result));
```

Note that the URL argument is still supplied, in order to identify the web site and use its custom parser, if it has any, though it will not be used for fetching content.

#### The command-line parser

Mercury Parser also ships with a CLI, meaning you can use it from your command line like so:

```bash
# Install Mercury Parser globally
yarn global add @jocmp/mercury-parser
#   or
npm -g install @jocmp/mercury-parser

# Then
mercury-parser https://postlight.com/trackchanges/mercury-goes-open-source

# Pass optional --format argument to set content type (html|markdown|text)
mercury-parser https://postlight.com/trackchanges/mercury-goes-open-source --format=markdown

# Pass optional --header.name=value arguments to include custom headers in the request
mercury-parser https://postlight.com/trackchanges/mercury-goes-open-source --header.Cookie="name=value; name2=value2; name3=value3" --header.User-Agent="Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1"

# Pass optional --extend argument to add a custom type to the response
mercury-parser https://postlight.com/trackchanges/mercury-goes-open-source --extend credit="p:last-child em"

# Pass optional --extend-list argument to add a custom type with multiple matches
mercury-parser https://postlight.com/trackchanges/mercury-goes-open-source --extend-list categories=".meta__tags-list a"

# Get the value of attributes by adding a pipe to --extend or --extend-list
mercury-parser https://postlight.com/trackchanges/mercury-goes-open-source --extend-list links=".body a|href"

# Pass optional --add-extractor argument to add a custom extractor at runtime.
mercury-parser https://postlight.com/trackchanges/mercury-goes-open-source --add-extractor ./src/extractors/fixtures/postlight.com/index.js
```

## License

Licensed under either of the below, at your preference:

- Apache License, Version 2.0
  ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license
  ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

## Contributing

For details on how to contribute to Mercury Parser, including how to write a custom content extractor for any site, see [CONTRIBUTING.md](./CONTRIBUTING.md)

Unless it is explicitly stated otherwise, any contribution intentionally submitted for inclusion in the work, as defined in the Apache-2.0 license, shall be dual licensed as above without any additional terms or conditions.
