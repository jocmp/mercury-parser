import nodeResolve from '@rollup/plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/mercury.ts',
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationDir: undefined,
      compilerOptions: {
        module: 'ES2022',
      },
    }),
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
