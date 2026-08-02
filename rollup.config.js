import commonjs from '@rollup/plugin-commonjs';
import srcAlias from './rollup.src-alias.js';

export default {
  input: 'src/mercury.js',
  plugins: [srcAlias(), commonjs()],
  treeshake: true,
  output: {
    file: process.env.MERCURY_TEST_BUILD
      ? 'dist/mercury_test.js'
      : 'dist/mercury.js',
    format: 'cjs',
    sourcemap: true,
  },
};
