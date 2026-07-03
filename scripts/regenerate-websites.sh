#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Cleaning generated outputs..."
npm run clean

echo "Building all packages and static websites..."
npm run build

echo "Validating example website YAML..."
npm run validate:examples

echo "Fresh websites are ready in apps/website-builder/dist"
