import { env } from 'cloudflare:workers';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@/types';

vi.mock('@/analytics', () => ({
	sessionLifecycleEvent: vi.fn(),
}));

// sessions.ts reads env at call time (not import time), so mutating the shared
// cloudflare:workers mock is enough — no vi.mock needed.
const mockDoStub = {
	getSession: vi.fn(),
	saveSession: vi.fn(),
	revokeSession: vi.fn(),
};

const mockSessionDO = {
	idFromName: vi.fn().mockReturnValue('mock-do-id'),
	get: vi.fn().mockReturnValue(mockDoStub),
};

beforeAll(() => {
	const mockEnv = env as unknown as Record<string, unknown>;
	mockEnv.SESSION_SECRET_KEY = 'test-secret-key-for-sessions-testing';
	mockEnv.SESSION_DURABLE_OBJECT = mockSessionDO;
});

// Import after env is populated
import { sessions } from '../sessions';

const SESSION_COOKIE_KEY = 'rwsdk-jeopardy-session';

const baseSession: Session = {
	sessionId: 'test-session-id',
	userId: 'user-123',
	lastAccessedAt: Date.now(),
};

// Extract the raw cookie value from a Set-Cookie header
const extractCookieValue = (headers: Headers): string | null =>
	headers.get('Set-Cookie')?.match(new RegExp(`${SESSION_COOKIE_KEY}=([^;]+)`))?.[1] ?? null;

// Build a request carrying a given raw cookie value
const requestWithCookie = (value: string) =>
	new Request('https://example.com', { headers: { Cookie: `${SESSION_COOKIE_KEY}=${value}` } });

// Helper: run upsert and return the signed cookie it produces
const getValidCookie = async (sessionId = 'round-trip-session-id'): Promise<string> => {
	const headers = new Headers();
	await sessions.upsert(sessionId, headers, {});
	const value = extractCookieValue(headers);
	if (!value) throw new Error('upsert did not set a cookie');
	return value;
};

describe('sessions.upsert', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockDoStub.saveSession.mockResolvedValue(baseSession);
	});

	it('generates a new UUID session ID when called with null', async () => {
		await sessions.upsert(null, new Headers(), {});
		const calledWith = mockSessionDO.idFromName.mock.calls[0][0] as string;
		expect(calledWith).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
	});

	it('uses the provided session ID when not null', async () => {
		await sessions.upsert('my-session-id', new Headers(), {});
		expect(mockSessionDO.idFromName).toHaveBeenCalledWith('my-session-id');
	});

	it('sets Set-Cookie header on the provided headers', async () => {
		const headers = new Headers();
		await sessions.upsert(null, headers, {});
		expect(headers.get('Set-Cookie')).toContain(`${SESSION_COOKIE_KEY}=`);
	});

	it('cookie value is base64-encoded and contains the session ID', async () => {
		const headers = new Headers();
		await sessions.upsert('my-session', headers, {});
		const value = extractCookieValue(headers);
		if (!value) throw new Error('upsert did not set a cookie');
		const decoded = atob(value);
		expect(decoded).toContain('my-session');
	});

	it('sets a 14-day max age on the cookie', async () => {
		const headers = new Headers();
		await sessions.upsert(null, headers, {});
		expect(headers.get('Set-Cookie')).toContain('Max-Age=1209600');
	});

	it('returns the session from DO.saveSession', async () => {
		const result = await sessions.upsert(null, new Headers(), {});
		expect(result).toBe(baseSession);
	});

	it('passes sessionData to DO.saveSession', async () => {
		await sessions.upsert('session-id', new Headers(), { userId: 'user-456' });
		expect(mockDoStub.saveSession).toHaveBeenCalledWith('session-id', { userId: 'user-456' });
	});

	it('two upserts with the same ID call idFromName with the same value', async () => {
		await sessions.upsert('stable-id', new Headers(), { userId: null });
		await sessions.upsert('stable-id', new Headers(), { userId: 'user-123' });
		const calls = mockSessionDO.idFromName.mock.calls.map(c => c[0]);
		expect(calls).toEqual(['stable-id', 'stable-id']);
	});
});

describe('sessions.loadFromRequest', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockDoStub.saveSession.mockResolvedValue(baseSession);
		mockDoStub.getSession.mockResolvedValue(baseSession);
	});

	it('returns null when request has no Cookie header', async () => {
		const result = await sessions.loadFromRequest(new Request('https://example.com'), new Headers());
		expect(result).toBeNull();
	});

	it('returns null when cookie exists but does not contain the session key', async () => {
		const request = new Request('https://example.com', {
			headers: { Cookie: 'some-other=value' },
		});
		const result = await sessions.loadFromRequest(request, new Headers());
		expect(result).toBeNull();
	});

	it('throws when the cookie signature has been tampered with', async () => {
		const tampered = btoa('legitimate-uuid:invalidsignature');
		await expect(sessions.loadFromRequest(requestWithCookie(tampered), new Headers())).rejects.toThrow('Invalid session ID');
	});

	it('throws when the cookie value is not valid base64', async () => {
		await expect(sessions.loadFromRequest(requestWithCookie('not-base64!!!'), new Headers())).rejects.toThrow(
			'Invalid session ID',
		);
	});

	it('returns the session from DO when cookie round-trips correctly', async () => {
		const cookie = await getValidCookie();
		const result = await sessions.loadFromRequest(requestWithCookie(cookie), new Headers());
		expect(result).toBe(baseSession);
	});

	it('calls DO with the session ID embedded in the cookie', async () => {
		const cookie = await getValidCookie('known-session-id');
		await sessions.loadFromRequest(requestWithCookie(cookie), new Headers());
		expect(mockSessionDO.idFromName).toHaveBeenCalledWith('known-session-id');
	});

	it('returns null and clears cookie when DO.getSession throws', async () => {
		const cookie = await getValidCookie();
		mockDoStub.getSession.mockRejectedValue(new Error('Session expired'));

		const headers = new Headers();
		const result = await sessions.loadFromRequest(requestWithCookie(cookie), headers);

		expect(result).toBeNull();
		expect(headers.get('Set-Cookie')).toContain('Max-Age=0');
	});

	it('does not call DO when no cookie is present', async () => {
		await sessions.loadFromRequest(new Request('https://example.com'), new Headers());
		expect(mockDoStub.getSession).not.toHaveBeenCalled();
	});
});

describe('sessions.clear', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockDoStub.saveSession.mockResolvedValue(baseSession);
		mockDoStub.getSession.mockResolvedValue(baseSession);
		mockDoStub.revokeSession.mockResolvedValue(undefined);
	});

	it('does nothing when request has no cookie', async () => {
		await sessions.clear(new Request('https://example.com'), new Headers());
		expect(mockDoStub.revokeSession).not.toHaveBeenCalled();
	});

	it('does nothing when cookie does not contain the session key', async () => {
		const request = new Request('https://example.com', { headers: { Cookie: 'other=value' } });
		await sessions.clear(request, new Headers());
		expect(mockDoStub.revokeSession).not.toHaveBeenCalled();
	});

	it('throws when the cookie signature is invalid', async () => {
		const tampered = btoa('some-uuid:invalidsignature');
		await expect(sessions.clear(requestWithCookie(tampered), new Headers())).rejects.toThrow('Invalid session ID');
	});

	it('calls revokeSession on the DO when cookie is valid', async () => {
		const cookie = await getValidCookie('clear-session-id');
		await sessions.clear(requestWithCookie(cookie), new Headers());
		expect(mockDoStub.revokeSession).toHaveBeenCalled();
	});

	it('clears the cookie with Max-Age=0 after revoking', async () => {
		const cookie = await getValidCookie('clear-session-id');
		const headers = new Headers();
		await sessions.clear(requestWithCookie(cookie), headers);
		expect(headers.get('Set-Cookie')).toContain('Max-Age=0');
	});

	it('revokes the correct DO identified by the cookie', async () => {
		const cookie = await getValidCookie('specific-session-id');
		await sessions.clear(requestWithCookie(cookie), new Headers());
		expect(mockSessionDO.idFromName).toHaveBeenCalledWith('specific-session-id');
	});
});

describe('cookie round-trip', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockDoStub.saveSession.mockResolvedValue(baseSession);
		mockDoStub.getSession.mockResolvedValue(baseSession);
		mockDoStub.revokeSession.mockResolvedValue(undefined);
	});

	it('a cookie produced by upsert is accepted by loadFromRequest', async () => {
		const cookie = await getValidCookie('rt-session');
		const result = await sessions.loadFromRequest(requestWithCookie(cookie), new Headers());
		expect(result).toBe(baseSession);
	});

	it('a cookie produced by upsert is accepted by clear', async () => {
		const cookie = await getValidCookie('rt-session');
		await expect(sessions.clear(requestWithCookie(cookie), new Headers())).resolves.not.toThrow();
		expect(mockDoStub.revokeSession).toHaveBeenCalled();
	});

	it('upsert with same session ID twice signs consistently', async () => {
		const headers1 = new Headers();
		const headers2 = new Headers();
		await sessions.upsert('consistent-id', headers1, {});
		await sessions.upsert('consistent-id', headers2, {});

		const cookie1 = extractCookieValue(headers1);
		const cookie2 = extractCookieValue(headers2);
		expect(cookie1).toBe(cookie2);
	});
});
