import js from '@eslint/js';
import globals from 'globals';
import importX, { createNodeResolver } from 'eslint-plugin-import-x';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['**/fixtures/**', 'dist/**', 'coverage/**', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      'import-x': importX,
    },
    settings: {
      'import-x/resolver-next': [createNodeResolver()],
    },
    rules: {
      'no-control-regex': 0,
      'no-empty': ['error', { allowEmptyCatch: true }],
      'import-x/no-cycle': 'error',
    },
  },
];
