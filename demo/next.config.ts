import type { NextConfig } from 'next';
import path from 'path';

const repoRoot = path.resolve(__dirname, '..');

const nextConfig: NextConfig = {
  turbopack: {
    root: repoRoot,
    resolveAlias: {
      mercury: '../src/mercury.js',
      'resource': '../src/resource/index.js',
      'resource/*': '../src/resource/*',
      'utils': '../src/utils/index.js',
      'utils/*': '../src/utils/*',
      'cleaners': '../src/cleaners/index.js',
      'cleaners/*': '../src/cleaners/*',
      'extractors': '../src/extractors/index.js',
      'extractors/*': '../src/extractors/*',
    },
  },
  // Allow importing from parent directory
  transpilePackages: ['mercury'],
};

export default nextConfig;
