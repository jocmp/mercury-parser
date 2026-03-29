export default function setAttr(node: any, attr: string, val: any) {
  if (node.attribs) {
    node.attribs[attr] = val;
  } else if (node.attributes) {
    node.setAttribute(attr, val);
  }

  return node;
}
