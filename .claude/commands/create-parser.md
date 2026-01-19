Please generate a custom extract for the following link: \$ARGUMENTS.

Follow these steps:

1. Generate the new parser with the link via `npm run generate-parser <link>`
2. Run the test against the new parser via `npm run watch:test <domain>`.
3. Fill out each test for each attribute as applicable. Prefer meta tags first, then HTML attributes like `h1` or `article`, and then finally CSS selectors if the first two options do not fit (Example src/extractors/custom/www.phoronix.com/index.js).

- The goal is to create repeatable parsers, so avoiding brittle selectors is very important

4. Ensure code passes linting and type checking
