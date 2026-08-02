// Find descendants of $context matching selector, in time linear in the size
// of the subtree.
//
// Both `$context.find(selector)` and `$(selector, $context)` hand cheerio the
// context's direct children as the search roots, and cheerio deduplicates that
// list with `domutils.removeSubsets()`, which is quadratic in the number of
// roots. An article body with thousands of direct children spends most of the
// parse there.
//
// Cheerio takes a different path for selectors starting with `:scope`, using
// the context node itself as the single search root. `:is()` applies that to
// compound and comma-separated selectors too. Cheerio's `:scope` still matches
// the context node, so it is filtered back out to preserve descendant-only
// semantics.
export default function findWithin($context, selector) {
  return $context.find(`:scope :is(${selector})`).not($context);
}
