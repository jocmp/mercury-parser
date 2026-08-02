// Whitespace-significant elements, whose contents must be preserved verbatim.
const OPEN_BLOCK_RE = /<(pre|code|textarea)[^>]*>/gi;
const CLOSE_BLOCK_RE = {
  pre: /<\/pre>/gi,
  code: /<\/code>/gi,
  textarea: /<\/textarea>/gi,
};

const WHITESPACE_RE = /\s{2,}/g;

// Collapse runs of whitespace, except inside <pre>/<code>/<textarea>.
//
// Walks the string, carving out those blocks and collapsing only the segments
// between them. This replaces a single regex whose
// `(?![^<>]*<\/(pre|code|textarea)>)` lookahead re-scanned to end-of-string at
// every whitespace run, making it O(n^2) on tag-free text such as $node.text().
//
// Each opening tag costs at most one forward search for its close, and an
// unmatched open ends the walk instead of restarting a character later, so the
// pass stays linear even on malformed input.
export default function normalizeSpaces(text) {
  let result = '';
  let cursor = 0;
  let open;

  // `exec` on a /g regex is stateful, and the loop below can exit early.
  OPEN_BLOCK_RE.lastIndex = 0;

  while ((open = OPEN_BLOCK_RE.exec(text)) !== null) {
    const closeRe = CLOSE_BLOCK_RE[open[1].toLowerCase()];
    closeRe.lastIndex = OPEN_BLOCK_RE.lastIndex;
    const close = closeRe.exec(text);

    // Unclosed block: nothing further to preserve, so collapse the rest below.
    if (close === null) break;

    const blockEnd = close.index + close[0].length;
    result += text.slice(cursor, open.index).replace(WHITESPACE_RE, ' ');
    result += text.slice(open.index, blockEnd);
    cursor = blockEnd;
    OPEN_BLOCK_RE.lastIndex = blockEnd;
  }

  return (result + text.slice(cursor).replace(WHITESPACE_RE, ' ')).trim();
}
