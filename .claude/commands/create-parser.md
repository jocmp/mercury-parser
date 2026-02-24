Please generate a custom extract for the following link: \$ARGUMENTS.

Follow these steps:

1. Generate the new parser with the link via `npm run generate-parser -- <link>`. Do not continue if this command fails and do not offer to manually fetch the page and say why it failed.

   - This creates `index.js`, `index.test.js`, and an HTML fixture file in `fixtures/<domain>`

2. Fill out selectors for each attribute:

   - `title`, `author`, `date_published`, `dek`, `lead_image_url`, `content`

   Selector priority (most to least preferred):

   1. **Meta tags**: `['meta[name="og:title"]', 'value']` - most stable
   2. **Semantic HTML**: `h1`, `article`, `time[datetime]` - usually stable
   3. **CSS selectors**: last resort, most brittle

   Guidelines:

   - Prefer a single selector over multiple in the `selectors` array. If you use a CSS Selector for the content, fall back to a semantic HTML tag.
   - The goal is repeatable parsers - avoid brittle selectors
   - If h2 elements are primarily used for section headings within article content, add a transform to preserve them: `h2: node => node.attr('class', 'mercury-parser-keep')`
   - See `src/extractors/custom/www.phoronix.com/index.js` for an example

3. Remove boilerplate comments from `index.js` and `index.test.js`

4. Make sure tests pass with `npx jest <domain>`

5. Build using `npm run build` then show me the output of `npx mercury-parser <link>` then ask me these questions: 1. If any changes are needed or 2. If I want to see a preview of the output. If 2 is chosen, create a tmp file with the contents of `.claude/template.html` and replace all the tokens with the output of the mercury-parser command