export default function getAttrs(node: any) {
  const { attribs, attributes } = node;

  if (!attribs && attributes) {
    const attrs: Record<string, any> = Reflect.ownKeys(attributes).reduce((acc: Record<string, any>, index) => {
      const attr = attributes[index as any];

      // In browser, Reflect.ownKeys includes non-numeric keys like 'length', 'item', etc.
      if (!attr || !attr.name || !attr.value) return acc;

      acc[attr.name] = attr.value;
      return acc;
    }, {});
    return attrs;
  }

  return attribs;
}
