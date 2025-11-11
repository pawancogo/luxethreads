#!/usr/bin/env bash

# Docker build script that reads Node.js version from .node-version
# Similar to how nvm uses .nvmrc

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Read Node.js version from .node-version or .nvmrc
if [[ -f "$SCRIPT_DIR/.node-version" ]]; then
  NODE_VERSION="$(cat "$SCRIPT_DIR/.node-version" | tr -d '\n' | sed 's/^v//')"
  echo "Using Node.js version from .node-version: ${NODE_VERSION}"
elif [[ -f "$SCRIPT_DIR/.nvmrc" ]]; then
  NODE_VERSION="$(cat "$SCRIPT_DIR/.nvmrc" | tr -d '\n' | sed 's/^v//')"
  echo "Using Node.js version from .nvmrc: ${NODE_VERSION}"
else
  NODE_VERSION="22.12.0"
  echo "Warning: .node-version or .nvmrc not found, using default: ${NODE_VERSION}"
fi

# Build Docker image with version from file
docker build \
  --build-arg NODE_VERSION="${NODE_VERSION}" \
  -t luxethreads-frontend:latest \
  "$@"

echo "Docker image built successfully with Node.js ${NODE_VERSION}"

