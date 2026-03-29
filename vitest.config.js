/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [nodePolyfills()],
  test: {
    include: ['src/**/*.test.ts'],
    // Exclude tests that use fs.readFileSync for fixtures - they run in Node via Jest
    exclude: [
      'src/extractors/custom/**/*.test.ts',
      'src/extractors/root-extractor.test.ts',
      'src/extractors/generic/index.test.ts',
      'src/extractors/generic/content/extractor.test.ts',
      'src/extractors/generic/content/extract-best-node.test.ts',
      'src/extractors/generic/content/scoring/find-top-candidate.test.ts',
      'src/extractors/generic/content/scoring/score-content.test.ts',
      'src/extractors/generic/next-page-url/extractor.test.ts',
      'src/extractors/generic/next-page-url/scoring/score-links.test.ts',
      'src/cleaners/content.test.ts',
      'src/utils/text/get-encoding.test.ts',
    ],
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: true,
    },
    // Use same module aliases as the project
    alias: {
      mercury: path.resolve(__dirname, 'src/mercury.ts'),
      resource: path.resolve(__dirname, 'src/resource'),
      utils: path.resolve(__dirname, 'src/utils'),
      cleaners: path.resolve(__dirname, 'src/cleaners'),
      extractors: path.resolve(__dirname, 'src/extractors'),
      'test-helpers': path.resolve(__dirname, 'src/test-helpers.ts'),
    },
  },
  resolve: {
    alias: {
      mercury: path.resolve(__dirname, 'src/mercury.ts'),
      resource: path.resolve(__dirname, 'src/resource'),
      utils: path.resolve(__dirname, 'src/utils'),
      cleaners: path.resolve(__dirname, 'src/cleaners'),
      extractors: path.resolve(__dirname, 'src/extractors'),
      'test-helpers': path.resolve(__dirname, 'src/test-helpers.ts'),
    },
  },
});
