import assert from 'assert';

export function clean(string) {
  return string
    .trim()
    .replace(/\r?\n|\r/g, '')
    .replace(/\s+/g, ' ');
}

export function assertClean(a, b) {
  assert.equal(clean(a), clean(b));
}

export class MockDomNode {
  constructor() {
    this.attributes = [
      {
        name: 'class',
        value: 'foo bar',
      },
    ];
  }

  setAttribute(key, val) {
    this.attributes.pop();
    this.attributes.push({ name: key, value: val });
  }

  removeAttribute() {
    this.attributes.pop();
  }
}
