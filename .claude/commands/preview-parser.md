Render a preview of a parser's output for the following link: \$ARGUMENTS.

Use this to visually inspect what a custom parser produces (e.g. after building it
with `/create-parser`). Follow these steps:

1. Build the parser bundle with `npm run build`. Do not continue if this fails.

2. Run `npx mercury-parser <link>` and capture the JSON output. Do not continue if
   the command fails and do not offer to manually fetch the page — say why it failed.

3. Create a tmp file (e.g. `/tmp/<domain>-preview.html`) with the contents of
   `.claude/template.html`, replacing every `{{TOKEN}}` with the matching field from
   the mercury-parser output:

   - `{{TITLE}}`, `{{AUTHOR}}`, `{{DATE_PUBLISHED}}`, `{{DOMAIN}}`, `{{URL}}`,
     `{{EXCERPT}}`, `{{WORD_COUNT}}`, `{{DIRECTION}}`, `{{RENDERED_PAGES}}`,
     `{{TOTAL_PAGES}}`, `{{LEAD_IMAGE_URL}}`, `{{DEK}}`, `{{NEXT_PAGE_URL}}`, `{{CONTENT}}`

   Guidelines:

   - Insert `{{CONTENT}}` as raw HTML (it's the rendered article body) — do not escape it.
   - Render `null`/missing fields as the literal `null` so gaps are obvious.
   - Do the substitution programmatically (parse the JSON, replace tokens) rather than
     by hand, so long content bodies stay intact.

4. Report the tmp file path and a short summary (title, word count, number of inline
   `<img>` tags in the content). Suggest opening it with `! open <path>`.
