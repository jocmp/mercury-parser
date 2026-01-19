Please generate a custom extract for the following link: \$ARGUMENTS.

Follow these steps:

1. Generate the new parser with the link via `npm run generate-parser -- <link>`

   - This creates `index.js`, `index.test.js`, and an HTML fixture file

2. Run the test against the new parser via `npm run watch:test <domain>`

3. Fill out selectors for each attribute:

   - `title`, `author`, `date_published`, `dek`, `lead_image_url`, `content`

   Selector priority (most to least preferred):

   1. **Meta tags**: `['meta[name="og:title"]', 'value']` - most stable
   2. **Semantic HTML**: `h1`, `article`, `time[datetime]` - usually stable
   3. **CSS selectors**: last resort, most brittle

   Guidelines:

   - Prefer a single selector over multiple in the `selectors` array. If you use a CSS Selector for the content, fall back to a semantic HTML tag.
   - The goal is repeatable parsers - avoid brittle selectors
   - See `src/extractors/custom/www.phoronix.com/index.js` for an example

4. Remove boilerplate comments from `index.js` and `index.test.js`

5. Ensure code passes `make check test`
