import nodeResolve from '@rollup/plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import srcAlias from './rollup.src-alias.js';

export default {
  input: 'src/mercury.js',
  plugins: [
    srcAlias(),
    commonjs({
      ignoreGlobal: true,
    }),
    globals(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    terser(),
  ],
  treeshake: true,
  output: {
    file: process.env.MERCURY_TEST_BUILD
      ? 'dist/mercury_test.esm.js'
      : 'dist/mercury.esm.js',
    format: 'es',
    sourcemap: true,
  },
};
