#!/usr/bin/env bash
set -euo pipefail

FIXTURE="fixtures/arstechnica.com/1739238328741.html"
URL="https://arstechnica.com/science/2025/02/twenty-two-states-sue-to-block-new-nih-funding-policy/"

REPO_DIR=$(pwd)
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

echo "==> Packing mercury-parser"
TARBALL=$(npm pack --silent --pack-destination "$WORK_DIR" | tail -1)

echo "==> Installing $TARBALL into a fresh ESM project"
cd "$WORK_DIR"
npm init -y > /dev/null
npm pkg set type=module
npm install --silent --no-audit --no-fund "./$TARBALL"
cp "$REPO_DIR/$FIXTURE" fixture.html

cat > consumer.mjs <<JS
import { readFileSync } from 'node:fs';

const { default: Parser } = await import('@jocmp/mercury-parser');
const html = readFileSync('fixture.html', 'utf8');
const result = await Parser.parse('$URL', { html });

if (!result?.content || result.content.length <= 40) {
  console.error('FAIL: ESM consumer got no content', result);
  process.exit(1);
}

console.log(\`PASS: ESM import parsed "\${result.title}" (\${result.content.length} chars)\`);
JS

echo "==> Importing as ESM, the way RSSHub does"
node consumer.mjs

echo "==> Requiring as CommonJS"
node -e "
const Parser = require('@jocmp/mercury-parser');
if (typeof Parser.parse !== 'function') {
  console.error('FAIL: require() did not expose Parser.parse');
  process.exit(1);
}
console.log('PASS: CommonJS require exposes Parser.parse');
"
