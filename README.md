# Jeopardy

A real-time, multiplayer Jeopardy game built with [RedwoodSDK](https://rwsdk.com), demonstrating a more involved use case for `useSyncedState` backed by Cloudflare Durable Objects.

## Overview

Multiple contestants connect to a shared game session from separate devices. State is synchronized in real-time across all connected clients via WebSocket — no polling, no manual sync logic.

There are three roles:

- **Host** — controls game flow, judges responses, and manages contestants
- **Display** — a dedicated screen showing the board and clues (think: the TV in the room)
- **Contestant** — selects clues on their turn and buzzes in to respond

## How It Works

All shared game state (`connections`, `selectedClue`, `gamePhase`, `buzzerQueue`) lives in `useSyncedState` keys. When any client updates a value, all connected clients see the change immediately.

This project is intended to showcase how `useSyncedState` can coordinate complex multi-client interactions — role assignment, turn management, buzzer logic — without any custom WebSocket handling or server-side orchestration code.

## Getting Started

```bash
pnpm install
pnpm dev
```

Navigate to `/game/:gameId` from multiple devices or browser tabs. One participant should select the **Host** role to start the game.

## Project Structure

```
src/
  app/
    components/   # Shared UI components (Board, Buzzer, Scoreboard, etc.)
    pages/
      game.tsx    # Main game component — state management and role-based routing
    views/        # Role-specific views (HostView, ContestantView, DisplayView, SetupView)
  types/          # Shared TypeScript types (Clue, Category, Connection, etc.)
  utils/          # Helper functions
  categories.ts   # Clue and category data
```

## Contributing

Contributions welcome. If you're familiar with RedwoodSDK and want to extend the game (scoring, multiple rounds, custom clue sets, etc.) please open an issue or PR.

## Visual Tests

Need to generate images on linux to avoid mismatching architectures.

```sh
docker run --rm \
  -v $(pwd):/work/ \
  -v /work/node_modules \
  -w /work/ \
  mcr.microsoft.com/playwright:v1.58.2-noble \
  /bin/sh -c "npm install -g pnpm && pnpm install && pnpm playwright:update"
```

## GH Workflows

### Token

For the `SEMANTIC_RELEASE_TOKEN` variable in github actions:
- Scope it to the `rwsdk-jeopardy` repo 
- Repo perms
  - Content read/write
  - Metadata read
- 90 days