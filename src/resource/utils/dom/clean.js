import { TAGS_TO_REMOVE } from './constants';

// Walk the tree explicitly rather than using
// `$.root().find('*').contents().filter(isComment)`, which builds its combined
// child list by repeated array concatenation and so is quadratic in node count.
function cleanComments($) {
  const root = $.root().get(0);
  const stack = root ? [root] : [];
  const comments = [];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node.type === 'comment') {
      comments.push(node);
    } else if (node.children) {
      // One at a time: spreading a wide child list exceeds the argument limit
      // on documents with hundreds of thousands of siblings.
      for (const child of node.children) stack.push(child);
    }
  }

  // Remove after the walk so sibling links stay intact while traversing.
  $(comments).remove();

  return $;
}

export default function clean($) {
  $(TAGS_TO_REMOVE).remove();

  $ = cleanComments($);
  return $;
}
