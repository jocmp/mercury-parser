import ellipsize from './index';

const ELLIPSE = '…';

describe('ellipsize simple cases', () => {
  const cases = [
    {
      label: 'zero length string',
      len: 100,
      string: '',
      expected: '',
    },
    {
      label: 'simple string',
      len: 8,
      string: 'one two three four',
      expected: `one two${ELLIPSE}`,
    },
    {
      label: 'long string gets truncated',
      len: 8,
      string: '12345678910',
      expected: `1234567${ELLIPSE}`,
    },
    {
      label: 'dashes are also a "word boundary"',
      len: 8,
      string: 'one two-three four',
      expected: `one two${ELLIPSE}`,
    },
    {
      label: 'dont ellipsize short strings',
      len: 100,
      string: 'one two three four',
      expected: 'one two three four',
    },
    {
      label: 'multibyte characters',
      len: 5,
      string: '审核未通过',
      expected: '审核未通过',
    },
    {
      label: 'multibyte characters ellipsised',
      len: 5,
      string: '审核未通过过',
      expected: `审核未通${ELLIPSE}`,
    },
    {
      label: 'length has a default',
      len: undefined,
      string:
        'xia3blpfgw9skc40k8k8808cw0cwk4wg88c4cwcokw88ggss40wo080so044og00gc4o40s88sowk8k4k0sswg0k84gws4ksg8so44gwcg0gkcwgc0wwcog08cwc0ogogsgkgcccko48w',
      expected:
        'xia3blpfgw9skc40k8k8808cw0cwk4wg88c4cwcokw88ggss40wo080so044og00gc4o40s88sowk8k4k0sswg0k84gws4ksg8so44gwcg0gkcwgc0wwcog08cwc0ogogsgkgcccko48w'.slice(
          0,
          139
        ) + ELLIPSE,
    },
    {
      label: 'zero length returns an empty string',
      len: 0,
      string: 'gc4o40s88sowk8k4k0ssw',
      expected: '',
    },
    {
      label: 'bogus null input',
      len: 0,
      string: null,
      expected: '',
    },
    {
      label: 'bogus undefined input',
      len: 0,
      string: undefined,
      expected: '',
    },
  ];

  cases.forEach(testCase => {
    it(testCase.label, () => {
      const result = ellipsize(testCase.string, testCase.len);
      expect(result).toBe(testCase.expected);
      expect(result.length <= testCase.len || 140).toBeTruthy();
    });
  });
});

describe('ellipsize truncate settings', () => {
  const cases = [
    {
      label: 'truncate settings off',
      len: 8,
      string: '123456789ABCDEF',
      expected: '',
      truncate: false,
    },
    {
      label: 'truncate settings on',
      len: 8,
      string: '123456789ABCDEF',
      expected: `1234567${ELLIPSE}`,
      truncate: true,
    },
    {
      label: 'truncate settings on and breakpoint at max length position',
      len: 4,
      string: '123 456',
      expected: `123${ELLIPSE}`,
      truncate: false,
    },
    {
      label: 'truncate settings default',
      len: 8,
      string: '123456789ABCDEF',
      expected: `1234567${ELLIPSE}`,
      truncate: undefined,
    },
    {
      label: 'truncate settings null',
      len: 8,
      string: '123456789ABCDEF',
      expected: `1234567${ELLIPSE}`,
      truncate: null,
    },
    {
      label: 'truncate settings middle',
      len: 8,
      string: '123456789ABCDEF',
      expected: `123${ELLIPSE}DEF`,
      truncate: 'middle',
    },
    {
      label: 'truncate settings middle edge case',
      len: 30,
      string: 'a',
      expected: 'a',
      truncate: 'middle',
    },
  ];

  cases.forEach(testCase => {
    it(testCase.label, () => {
      const result = ellipsize(testCase.string, testCase.len, {
        truncate: testCase.truncate,
      });
      expect(result).toBe(testCase.expected);
    });
  });
});

describe('ellipsize truncate middle', () => {
  const cases = [
    {
      label: 'truncate words settings middle short',
      len: 16,
      string: 'the quick brown fox',
      expected: `the${ELLIPSE} fox`,
      truncate: 'middle',
    },
    {
      label: 'truncate words settings middle longer',
      len: 37,
      string: 'These are a few of my favourite things',
      expected: `These are a few${ELLIPSE} favourite things`,
      truncate: 'middle',
    },
  ];

  cases.forEach(testCase => {
    it(testCase.label, () => {
      const result = ellipsize(testCase.string, testCase.len, {
        truncate: testCase.truncate,
      });
      expect(result).toBe(testCase.expected);
    });
  });
});

describe('ellipsize custom ellipse', () => {
  const cases = [
    {
      label: 'zero length string',
      len: 100,
      string: '',
      expected: '',
      ellipse: '--',
    },
    {
      label: 'two character ellipse',
      len: 9,
      string: 'one two three four',
      expected: 'one two--',
      ellipse: '--',
    },
    {
      label: 'unicode character ellipse',
      len: 8,
      string: 'one two three four',
      expected: 'one two☃',
      ellipse: '☃',
    },
    {
      label: 'off by one string',
      len: 8,
      string: 'one two three four',
      expected: 'one--',
      ellipse: '--',
    },
  ];

  cases.forEach(testCase => {
    it(testCase.label, () => {
      const { len, string, expected, ellipse } = testCase;
      const result = ellipsize(string, len, { ellipse });
      expect(result).toBe(expected);
      expect(result.length).toBeLessThanOrEqual(len);
    });
  });
});
