import commonjs from '@rollup/plugin-commonjs';
import srcAlias from '../rollup.src-alias.js';

export default {
  input: 'scripts/generate-custom-parser.js',
  plugins: [srcAlias(), commonjs()],
  treeshake: true,
  output: {
    file: 'dist/generate-custom-parser.js',
    format: 'cjs',
    sourcemap: true,
  },
};
