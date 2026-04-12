const defaults = {
  ellipse: '…',
  chars: [' ', '-'],
  max: 140,
  truncate: true,
};

function ellipsizeMiddle(str, max, ellipse, chars) {
  if (str.length <= max) return str;
  if (max < 2) return str.slice(0, max - ellipse.length) + ellipse;

  const maxLen = max - ellipse.length;
  const middle = Math.floor(maxLen / 2);

  let left = middle;
  let right = str.length - middle;

  for (let i = 0; i < middle; i += 1) {
    const charLeft = str.charAt(i);
    const posRight = str.length - i;
    const charRight = str.charAt(posRight);

    if (chars.indexOf(charLeft) !== -1) left = i;
    if (chars.indexOf(charRight) !== -1) right = posRight;
  }

  return str.slice(0, left) + ellipse + str.slice(right);
}

function ellipsize(str, max, ellipse, chars, truncate) {
  if (str.length <= max) return str;

  const maxLen = max - ellipse.length;
  let end = maxLen;
  let breakpointFound = false;

  for (let i = 0; i <= maxLen; i += 1) {
    const char = str.charAt(i);
    if (chars.indexOf(char) !== -1) {
      end = i;
      breakpointFound = true;
    }
  }

  if (!truncate && !breakpointFound) return '';

  return str.slice(0, end) + ellipse;
}

export default (str, max, opts) => {
  if (typeof str !== 'string' || str.length === 0) return '';
  if (max === 0) return '';

  opts = opts || {};

  Object.keys(defaults).forEach(key => {
    if (opts[key] === null || typeof opts[key] === 'undefined') {
      opts[key] = defaults[key];
    }
  });

  opts.max = max || opts.max;

  if (opts.truncate === 'middle')
    return ellipsizeMiddle(str, opts.max, opts.ellipse, opts.chars);

  return ellipsize(str, opts.max, opts.ellipse, opts.chars, opts.truncate);
};

export { ellipsizeMiddle };
