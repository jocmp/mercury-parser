export default function setAttrs(node: any, attrs: Record<string, any>) {
  if (node.attribs) {
    node.attribs = attrs;
  } else if (node.attributes) {
    while (node.attributes.length > 0) {
      node.removeAttribute(node.attributes[0].name);
    }

    Reflect.ownKeys(attrs).forEach(key => {
      node.setAttribute(key as string, attrs[key as string]);
    });
  }

  return node;
}
