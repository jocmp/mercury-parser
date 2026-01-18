/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [nodePolyfills()],
  test: {
    include: ['src/**/*.test.js'],
    // Exclude tests that use fs.readFileSync for fixtures - they run in Node via Jest
    exclude: [
      'src/extractors/custom/**/*.test.js',
      'src/extractors/root-extractor.test.js',
      'src/extractors/generic/index.test.js',
      'src/extractors/generic/content/extractor.test.js',
      'src/extractors/generic/content/extract-best-node.test.js',
      'src/extractors/generic/content/scoring/find-top-candidate.test.js',
      'src/extractors/generic/content/scoring/score-content.test.js',
      'src/extractors/generic/next-page-url/extractor.test.js',
      'src/extractors/generic/next-page-url/scoring/score-links.test.js',
      'src/cleaners/content.test.js',
      'src/utils/text/get-encoding.test.js',
    ],
    globals: true,
    setupFiles: ['./src/test-setup.js'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: true,
    },
    // Use same module aliases as the project
    alias: {
      mercury: path.resolve(__dirname, 'src/mercury.js'),
      resource: path.resolve(__dirname, 'src/resource'),
      utils: path.resolve(__dirname, 'src/utils'),
      cleaners: path.resolve(__dirname, 'src/cleaners'),
      extractors: path.resolve(__dirname, 'src/extractors'),
      'test-helpers': path.resolve(__dirname, 'src/test-helpers.js'),
    },
  },
  resolve: {
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
