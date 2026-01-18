import type { NextConfig } from 'next';
import path from 'path';

const srcPath = path.resolve(__dirname, '../src');

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Resolve mercury-parser source aliases
    config.resolve!.alias = {
      ...(config.resolve!.alias as Record<string, string>),
      mercury: path.join(srcPath, 'mercury.js'),
      resource: path.join(srcPath, 'resource'),
      utils: path.join(srcPath, 'utils'),
      cleaners: path.join(srcPath, 'cleaners'),
      extractors: path.join(srcPath, 'extractors'),
    };

    // For client-side, use browser shims
    if (!isServer) {
      config.resolve!.alias = {
        ...(config.resolve!.alias as Record<string, string>),
        cheerio: 'cheerio/slim',
        'iconv-lite': path.join(srcPath, 'shims/iconv-lite.js'),
      };

      // Polyfill node modules for browser
      config.resolve!.fallback = {
        ...config.resolve!.fallback,
        url: require.resolve('url/'),
        fs: false,
        path: false,
        http: false,
        https: false,
        stream: false,
        zlib: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
  // Allow importing from parent directory
  transpilePackages: ['mercury'],
};

export default nextConfig;
