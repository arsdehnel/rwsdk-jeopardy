import { describe, expect, it, vi } from 'vitest';
import { sessions } from '../sessions';

vi.mock('@/analytics', () => ({
	sessionLifecycleEvent: vi.fn(),
}));

const SESSION_COOKIE_KEY = 'rwsdk-jeopardy-session';

const extractCookieValue = (headers: Headers): string => {
	const value = headers.get('Set-Cookie')?.match(new RegExp(`${SESSION_COOKIE_KEY}=([^;]+)`))?.[1];
	if (!value) throw new Error('Set-Cookie header missing or session cookie not found');
	return value;
};

const requestWithCookie = (value: string) =>
	new Request('https://example.com', { headers: { Cookie: `${SESSION_COOKIE_KEY}=${value}` } });

describe('sessions middleware (workers integration)', () => {
	it('returns null for a cold request with no cookie', async () => {
		const result = await sessions.loadFromRequest(new Request('https://example.com'), new Headers());
		expect(result).toBeNull();
	});

	it('loads a session that was previously upserted', async () => {
		const headers = new Headers();
		const sessionId = crypto.randomUUID();
		await sessions.upsert(sessionId, headers, { userId: 'user-workers-1' });
		const cookie = extractCookieValue(headers);

		const result = await sessions.loadFromRequest(requestWithCookie(cookie), new Headers());
		expect(result?.userId).toBe('user-workers-1');
		expect(result?.sessionId).toBe(sessionId);
	});

	it('returns null after logout clears the session', async () => {
		// Create session
		const upsertHeaders = new Headers();
		const sessionId = crypto.randomUUID();
		await sessions.upsert(sessionId, upsertHeaders, { userId: 'user-workers-2' });
		const cookie = extractCookieValue(upsertHeaders);

		// Logout
		const clearHeaders = new Headers();
		await sessions.clear(requestWithCookie(cookie), clearHeaders);
		expect(clearHeaders.get('Set-Cookie')).toContain('Max-Age=0');

		// Subsequent load returns null — DO session was revoked
		const result = await sessions.loadFromRequest(requestWithCookie(cookie), new Headers());
		expect(result).toBeNull();
	});

	it('session data persists across multiple loads from real DO storage', async () => {
		const headers = new Headers();
		const sessionId = crypto.randomUUID();
		await sessions.upsert(sessionId, headers, { userId: 'persistent-user' });
		const cookie = extractCookieValue(headers);

		const first = await sessions.loadFromRequest(requestWithCookie(cookie), new Headers());
		const second = await sessions.loadFromRequest(requestWithCookie(cookie), new Headers());

		expect(first?.userId).toBe('persistent-user');
		expect(second?.userId).toBe('persistent-user');
	});

	it('throws Invalid session ID for a tampered cookie', async () => {
		const tampered = btoa('legitimate-uuid:invalidsignature');
		await expect(sessions.loadFromRequest(requestWithCookie(tampered), new Headers())).rejects.toThrow('Invalid session ID');
	});

	it('passkey auth flow: challenge and userId land in the same DO', async () => {
		// Step 1: anonymous session created pre-auth
		const step1Headers = new Headers();
		const { sessionId } = await sessions.upsert(null, step1Headers, {});

		// Step 2: challenge stored on the same session
		const step2Headers = new Headers();
		await sessions.upsert(sessionId, step2Headers, { challenge: 'abc123' });

		// Step 3: auth completes, userId written to the same session
		const step3Headers = new Headers();
		await sessions.upsert(sessionId, step3Headers, { userId: 'user-123' });
		const cookie = extractCookieValue(step3Headers);

		// Step 4: loading the session sees userId — proves all three upserts hit the same DO
		const result = await sessions.loadFromRequest(requestWithCookie(cookie), new Headers());
		expect(result?.sessionId).toBe(sessionId);
		expect(result?.userId).toBe('user-123');
	});
});
