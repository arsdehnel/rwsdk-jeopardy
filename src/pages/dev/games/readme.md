# Games Dev Pages

These pages are intended for local development and troubleshooting only.  They should never be used or even exposed in prod.  

## Mock Backend

The general pattern here is for a dev "page" to perform the same duties as the real page, the client-management view, _and_ the narrowing of that view to a specific role.  So `/dev/games/play/host.tsx` smashes together the `src/pages/games/play.tsx` with the host-specific part of `src/views/game-play.tsx` with a statically defined set of props (no D1 or synced state).  