#!/usr/bin/env bash
set -euo pipefail

# Smoke test: build mercury-parser, swap it into RSSHub, and verify
# the fulltext (mercury) endpoint works inside Docker.

RSSHUB_REF="${RSSHUB_REF:-master}"
CONTAINER_NAME="mercury-smoke-test"
PORT=11200
TIMEOUT=30

cleanup() {
  docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
  rm -rf "$WORK_DIR"
}

WORK_DIR=$(mktemp -d)
trap cleanup EXIT

echo "==> Building mercury-parser"
npm run build
TARBALL=$(npm pack --pack-destination "$WORK_DIR" 2>/dev/null | tail -1)
TARBALL_NAME=$(basename "$TARBALL")

echo "==> Cloning RSSHub (ref: $RSSHUB_REF)"
git clone --depth 1 --branch "$RSSHUB_REF" https://github.com/DIYGod/RSSHub.git "$WORK_DIR/rsshub"

echo "==> Patching RSSHub to use local mercury-parser"
cp "$WORK_DIR/$TARBALL_NAME" "$WORK_DIR/rsshub/"

cd "$WORK_DIR/rsshub"

# Point dependency at local tarball
python3 -c "
import json, sys
with open('package.json') as f:
    pkg = json.load(f)
pkg['dependencies']['@jocmp/mercury-parser'] = 'file:$TARBALL_NAME'
with open('package.json', 'w') as f:
    json.dump(pkg, f, indent=4)
"

# Add tarball COPY to Dockerfile
python3 -c "
with open('Dockerfile') as f:
    content = f.read()
content = content.replace(
    'COPY ./package.json /app/',
    'COPY ./package.json /app/\nCOPY ./$TARBALL_NAME /app/'
)
with open('Dockerfile', 'w') as f:
    f.write(content)
"

# Update lockfile
corepack enable pnpm
pnpm install --no-frozen-lockfile > /dev/null 2>&1

echo "==> Building Docker image"
docker build -t "$CONTAINER_NAME" . 2>&1 | tail -5

echo "==> Starting RSSHub"
docker run -d --name "$CONTAINER_NAME" -p "$PORT:1200" -e NODE_ENV=production "$CONTAINER_NAME"

echo "==> Waiting for RSSHub to start"
for i in $(seq 1 "$TIMEOUT"); do
  if curl -sf "http://localhost:$PORT/healthz" > /dev/null 2>&1; then
    echo "    RSSHub is ready (${i}s)"
    break
  fi
  if [ "$i" -eq "$TIMEOUT" ]; then
    echo "FAIL: RSSHub did not start within ${TIMEOUT}s"
    docker logs "$CONTAINER_NAME" 2>&1 | tail -20
    exit 1
  fi
  sleep 1
done

echo "==> Testing fulltext endpoint (mercury parser)"
RESPONSE=$(curl -sf "http://localhost:$PORT/hackernews/best?mode=fulltext&limit=1" 2>&1) || {
  echo "FAIL: endpoint returned an error"
  docker logs "$CONTAINER_NAME" 2>&1 | tail -20
  exit 1
}

if echo "$RESPONSE" | grep -q '<rss'; then
  echo "PASS: got valid RSS response with fulltext content"
else
  echo "FAIL: response is not valid RSS"
  echo "$RESPONSE" | head -20
  exit 1
fi
