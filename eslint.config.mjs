import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import path from 'path';
import babelParser from '@babel/eslint-parser';
import babelPlugin from '@babel/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  {
    ignores: [
      '**/fixtures/**',
      'dist/**',
      'coverage/**',
      'karma.conf.js',
      'demo/node_modules/**',
      'demo/.next/**',
      'eslint.config.mjs',
    ],
  },
  ...compat.extends('airbnb'),
  prettierConfig,
  {
    languageOptions: {
      parser: babelParser,
      globals: {
        describe: 'readonly',
        it: 'readonly',
        xit: 'readonly',
        fit: 'readonly',
        jasmine: 'readonly',
        beforeEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    plugins: {
      '@babel': babelPlugin,
    },
    settings: {
      'import/resolver': {
        'babel-module': {},
      },
    },
    rules: {
      'no-param-reassign': 0,
      'no-control-regex': 0,
      'import/prefer-default-export': 0,
      'generator-star-spacing': 0,
      '@babel/generator-star-spacing': 0,
      'func-names': 0,
      'no-confusing-arrow': 0,
      camelcase: 0,
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'import/no-unresolved': 0,
      'prefer-regex-literals': 0,
      'default-param-last': 0,
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.js',
            'scripts/proxy-browser-test.js',
            'rollup.config*js',
          ],
        },
      ],
    },
  },
];
