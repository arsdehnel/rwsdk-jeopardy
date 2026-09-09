#!/bin/sh
set -e

pnpm dlx \
  --package=semantic-release@25 \
  --package=@semantic-release/commit-analyzer@13 \
  --package=@semantic-release/release-notes-generator@14 \
  --package=@semantic-release/changelog@7 \
  --package=@semantic-release/npm@13 \
  --package=@semantic-release/git@11 \
  --package=@semantic-release/github@12 \
  --package=conventional-changelog-conventionalcommits@9 \
  semantic-release "$@"
