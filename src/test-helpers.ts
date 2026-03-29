import assert from 'assert';

export function clean(string: string) {
  return string
    .trim()
    .replace(/\r?\n|\r/g, '')
    .replace(/\s+/g, ' ');
}

export function assertClean(a: string, b: string) {
  assert.strictEqual(clean(a), clean(b));
}

export class MockDomNode {
  attributes: { name: string; value: string }[];

  constructor() {
    this.attributes = [
      {
        name: 'class',
        value: 'foo bar',
      },
    ];
  }

  setAttribute(key: string, val: string) {
    this.attributes.pop();
    this.attributes.push({ name: key, value: val });
  }

  removeAttribute() {
    this.attributes.pop();
  }
}
