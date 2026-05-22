#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="$ROOT/assets"
CURSOR_ASSETS="$HOME/.cursor/projects/Users-sandeep-Documents-Applications-sandeep/assets"

mkdir -p "$ASSETS"

if [[ -f "$CURSOR_ASSETS/splash.png" ]]; then
  cp "$CURSOR_ASSETS/splash.png" "$ASSETS/splash.png"
  cp "$CURSOR_ASSETS/icon.png" "$ASSETS/icon.png"
  cp "$CURSOR_ASSETS/icon.png" "$ASSETS/adaptive-icon.png"
  echo "Copied splash assets to $ASSETS"
else
  echo "Place splash.png and icon.png in $ASSETS (see README)."
  exit 1
fi
