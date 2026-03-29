export default function getAttrs(node) {
  const { attribs, attributes } = node;

  if (!attribs && attributes) {
    const attrs = Reflect.ownKeys(attributes).reduce((acc, index) => {
      const attr = attributes[index];

      // In browser, Reflect.ownKeys includes non-numeric keys like 'length', 'item', etc.
      if (!attr || !attr.name || !attr.value) return acc;

      acc[attr.name] = attr.value;
      return acc;
    }, {});
    return attrs;
  }

  return attribs;
}
