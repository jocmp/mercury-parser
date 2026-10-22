import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['src/**/*.test.js', 'nock/**/*.test.js'],
    globals: true,
    environment: 'node',
    alias: {
      mercury: path.resolve(__dirname, 'src/mercury.js'),
      resource: path.resolve(__dirname, 'src/resource'),
      utils: path.resolve(__dirname, 'src/utils'),
      cleaners: path.resolve(__dirname, 'src/cleaners'),
      extractors: path.resolve(__dirname, 'src/extractors'),
      'test-helpers': path.resolve(__dirname, 'src/test-helpers.js'),
    },
  },
});
