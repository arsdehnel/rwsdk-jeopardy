# Durable Objects

Cloudflare Durable Objects used by the application. Each file implements a single Durable Object class.

## Contents

- **`sessions.ts`** — `SessionDurableObject`: stores and manages user session state (userId, challenge, expiry). Also defines the `sessions` instance used by middleware and auth actions to read/write sessions. Exported from `worker.tsx` for Cloudflare to bind.

## Guidelines

- **No application logic** — Durable Objects manage state only; business logic belongs in actions or middleware
- **Exported from `worker.tsx`** — Cloudflare requires Durable Object classes to be re-exported from the worker entry point

---

## How the session layer works

`sessions.ts` has two distinct pieces that work together:

### 1. `sessions` — the module-level helper

```typescript
export const sessions = {
    loadFromRequest(request),          // read session from cookie + DO
    upsert(unsignedSessionId, headers, sessionData), // create/update session in DO + set cookie
    clear(request, headers),           // revoke session from DO + clear cookie
};
```

These are what you call from middleware and actions:

```typescript
await sessions.loadFromRequest(request);
// → reads the signed session ID from the cookie, validates the signature,
//   looks up the DO by name, and returns the Session (or null if no cookie)

await sessions.upsert(null, response.headers, { userId: user.id });
// → null creates a new session ID; non-null reuses an existing one.
//   writes sessionData to the DO and sets the signed cookie on the response.

await sessions.clear(request, response.headers);
// → revokes the DO and clears the cookie
```

### 2. `SessionDurableObject` — the actual Durable Object

```typescript
export class SessionDurableObject extends DurableObject { ... }
```

Defines how session data is physically stored, read, and expired. The DO name is the unsigned session ID — the same value stored as `sessionId` inside the session data itself.

| Method | Called by |
|---|---|
| `saveSession(unsignedSessionId, sessionData)` | `sessions.upsert(...)` |
| `getSession()` | `sessions.loadFromRequest(...)` |
| `revokeSession()` | `sessions.clear(...)` and internal expiry handling |

`getSession()` throws `'Invalid session'` when no session data exists and `'Session expired'` when `lastAccessedAt` is beyond the 14-day window. It also updates `lastAccessedAt` on every read (sliding expiration).

### Cookie and signing

The browser cookie (`rwsdk-jeopardy-session`) carries a base64-encoded value of `unsignedSessionId:hmacSignature`. The private `sessionCookie` helper inside `sessions.ts` handles all cookie read/write and signature verification using HMAC-SHA256 with `SESSION_SECRET_KEY`.

The cookie value is only a pointer — it identifies which DO to look up. All session data lives in the DO's KV storage.

### Session ID terminology

- **Unsigned session ID** — the raw UUID; used as the DO's `name` and stored as `sessionId` in the session data
- **Signed session ID** — base64(`unsignedId:hmacSignature`); what goes in the browser cookie

### Extending session data

Session data shape is defined by the `Session` interface in `src/types/sessions.ts`. To add a new field:

1. Add it to the `Session` interface
2. Pass it in the `sessionData` argument when calling `sessions.upsert(...)`

`sessionData` is typed as `Partial<Session>`, so new fields are automatically accepted by callers without any changes to the DO methods.
