# Code style

- When writing a parser
  - Prefer meta tags, e.g. `['meta[name="og:title"]', 'value']` over tags found in the HTML body.
  - Prefer using a single selector over adding multiple to the `selector` array
  - When all tests are running, remove the boilerplate comments from the parser's index.js and index.test.js file, e.g. comments like "This test should be passing by default."

# Workflow

- Prefer running single tests, and not the whole test suite, for performance
