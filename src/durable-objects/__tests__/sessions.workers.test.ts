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
});
