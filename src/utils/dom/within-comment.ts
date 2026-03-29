import getAttrs from './get-attrs';

export default function withinComment($node: any) {
  const parents = $node.parents().toArray();
  const commentParent = parents.find((parent: any) => {
    const attrs = getAttrs(parent);
    const { class: nodeClass, id } = attrs;
    const classAndId = `${nodeClass} ${id}`;
    return classAndId.includes('comment');
  });

  return commentParent !== undefined;
}
