#!/usr/bin/env bash

# Docker Compose build script that reads Node.js version from version files
# This ensures consistency between local setup and Docker builds

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Read Node.js version from .node-version or .nvmrc
if [[ -f "$SCRIPT_DIR/.node-version" ]]; then
  NODE_VERSION="$(cat "$SCRIPT_DIR/.node-version" | tr -d '\n' | sed 's/^v//')"
  export NODE_VERSION
  echo "Using Node.js version from .node-version: ${NODE_VERSION}"
elif [[ -f "$SCRIPT_DIR/.nvmrc" ]]; then
  NODE_VERSION="$(cat "$SCRIPT_DIR/.nvmrc" | tr -d '\n' | sed 's/^v//')"
  export NODE_VERSION
  echo "Using Node.js version from .nvmrc: ${NODE_VERSION}"
else
  NODE_VERSION="22.12.0"
  export NODE_VERSION
  echo "Warning: .node-version or .nvmrc not found, using default: ${NODE_VERSION}"
fi

# Build with docker-compose using version from file
NODE_VERSION="${NODE_VERSION}" \
  docker-compose -f docker-compose.production.yml build "$@"

echo "Docker Compose build complete with Node.js ${NODE_VERSION}"

