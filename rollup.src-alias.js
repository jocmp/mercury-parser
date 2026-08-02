import fs from 'fs';
import path from 'path';

const SRC = path.resolve('src');

// src/ imports itself with bare specifiers ('utils', 'extractors/get-extractor').
// babel-plugin-module-resolver used to resolve these; rollup needs it done here.
export default function srcAlias() {
  return {
    name: 'src-alias',
    async resolveId(source, importer, options) {
      if (source.startsWith('.') || source.startsWith('/')) {
        return null;
      }

      const base = path.join(SRC, source);
      const candidates = [`${base}.js`, path.join(base, 'index.js'), base];
      const match = candidates.find(
        candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()
      );

      if (!match) {
        return null;
      }

      // Hand the file back through the resolver chain instead of returning it
      // directly, so node-resolve registers its package context and keeps
      // applying package.json "browser" mappings to that file's own imports.
      const resolved = await this.resolve(match, importer, {
        ...options,
        skipSelf: true,
      });

      return resolved || match;
    },
  };
}
