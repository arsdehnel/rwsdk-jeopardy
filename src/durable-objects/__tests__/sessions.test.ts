import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@/types';
import { SessionDurableObject } from '../sessions';

vi.mock('@/analytics', () => ({
	sessionLifecycleEvent: vi.fn(),
}));

// Mock Cloudflare Durable Object infrastructure
class MockDurableObjectStorage {
	private store = new Map<string, unknown>();

	async get<T>(key: string): Promise<T | undefined> {
		return this.store.get(key) as T | undefined;
	}

	async put<T>(key: string, value: T): Promise<void> {
		this.store.set(key, value);
	}

	async delete(key: string): Promise<void> {
		this.store.delete(key);
	}
}

class MockDurableObjectState {
	storage = new MockDurableObjectStorage();
	id = { toString: () => 'test-session-id' };
	waitUntil = () => {};
	blockConcurrencyWhile = async (fn: () => Promise<void>) => await fn();
}

// Test class that allows time control
class TestSessionDurableObject extends SessionDurableObject {
	private mockTime: number = 1000000; // Start at a fixed time

	setTime(time: number) {
		this.mockTime = time;
	}

	protected now(): number {
		return this.mockTime;
	}

	// Test helper
	clearCache() {
		// biome-ignore lint/complexity/useLiteralKeys: accessing private parent property for testing
		this['session'] = undefined;
	}
}

describe('SessionDurableObject', () => {
	let session: TestSessionDurableObject;
	let mockState: MockDurableObjectState;
	let mockEnv: Cloudflare.Env;
	const START_TIME = 1000000;
	const MAX_SESSION_DURATION = 1209600000; // 14 days in ms
	const SESSION_ID = 'test-unsigned-session-id';

	beforeEach(() => {
		mockState = new MockDurableObjectState();
		mockEnv = {} as Cloudflare.Env;
		session = new TestSessionDurableObject(mockState as unknown as DurableObjectState, mockEnv);
		session.setTime(START_TIME);
	});

	describe('saveSession', () => {
		it('saves session with userId and returns it', async () => {
			const saved = await session.saveSession(SESSION_ID, { userId: 'user-123' });

			expect(saved.userId).toBe('user-123');
			expect(saved.lastAccessedAt).toBe(START_TIME);
		});

		it('saves session with challenge', async () => {
			const saved = await session.saveSession(SESSION_ID, { challenge: 'challenge-abc' });

			expect(saved.challenge).toBe('challenge-abc');
		});

		it('saves session with both userId and challenge', async () => {
			const saved = await session.saveSession(SESSION_ID, { userId: 'user-123', challenge: 'challenge-abc' });

			expect(saved.userId).toBe('user-123');
			expect(saved.challenge).toBe('challenge-abc');
		});

		it('sets sessionId to the provided unsignedSessionId', async () => {
			const saved = await session.saveSession(SESSION_ID, { userId: 'user-123' });

			expect(saved.sessionId).toBe(SESSION_ID);
		});

		it('always overwrites lastAccessedAt with current time', async () => {
			session.setTime(5000000);
			const saved = await session.saveSession(SESSION_ID, { userId: 'user-123', lastAccessedAt: 0 });

			expect(saved.lastAccessedAt).toBe(5000000);
		});

		it('persists session to storage', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			const stored = await mockState.storage.get<Session>('session');
			expect(stored?.userId).toBe('user-123');
		});

		it('overwrites existing session', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-1' });

			session.setTime(START_TIME + 1000);
			await session.saveSession(SESSION_ID, { userId: 'user-2' });

			const result = await session.getSession();
			expect(result.userId).toBe('user-2');
			expect(result.lastAccessedAt).toBe(START_TIME + 1000);
		});

		it('updates in-memory cache after save', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			// Get without clearing cache — should use cache
			const result = await session.getSession();
			expect(result.userId).toBe('user-123');
		});
	});

	describe('getSession', () => {
		it('returns session after save', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			const result = await session.getSession();

			expect(result.userId).toBe('user-123');
		});

		it('throws when no session exists', async () => {
			await expect(session.getSession()).rejects.toThrow('Invalid session');
		});

		it('uses cached session on subsequent calls', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			// First call populates cache
			await session.getSession();

			// Manually clear storage to verify cache is used
			await mockState.storage.delete('session');

			// Should still work from cache
			const result = await session.getSession();
			expect(result.userId).toBe('user-123');
		});

		it('updates lastAccessedAt on cached read', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			session.setTime(START_TIME + 5000);

			const result = await session.getSession();

			expect(result.lastAccessedAt).toBe(START_TIME + 5000);
		});

		it('updates lastAccessedAt in storage on cached read', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			session.setTime(START_TIME + 5000);
			await session.getSession();

			const stored = await mockState.storage.get<Session>('session');
			expect(stored?.lastAccessedAt).toBe(START_TIME + 5000);
		});

		it('updates lastAccessedAt on storage read', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			session.clearCache();

			session.setTime(START_TIME + 10000);
			const result = await session.getSession();

			expect(result.lastAccessedAt).toBe(START_TIME + 10000);
		});

		it('throws for expired session based on lastAccessedAt', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			session.clearCache();

			session.setTime(START_TIME + MAX_SESSION_DURATION + 1);

			await expect(session.getSession()).rejects.toThrow('Session expired');
		});

		it('revokes expired session from storage', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			session.clearCache();
			session.setTime(START_TIME + MAX_SESSION_DURATION + 1);

			await expect(session.getSession()).rejects.toThrow();

			const stored = await mockState.storage.get<Session>('session');
			expect(stored).toBeUndefined();
		});

		it('accepts session that has not expired', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			session.clearCache();

			session.setTime(START_TIME + 1000000);

			const result = await session.getSession();

			expect(result.userId).toBe('user-123');
		});

		it('accepts session exactly at expiration boundary', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			session.clearCache();

			// Exactly at expiration — should still be valid
			session.setTime(START_TIME + MAX_SESSION_DURATION);

			const result = await session.getSession();
			expect(result.userId).toBe('user-123');
		});

		it('sliding expiration extends session lifetime', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			// Access partway through duration — updates lastAccessedAt
			session.setTime(START_TIME + MAX_SESSION_DURATION / 2);
			await session.getSession();

			session.clearCache();

			// Past original expiration but within new window from last access
			session.setTime(START_TIME + MAX_SESSION_DURATION + 1000);

			const result = await session.getSession();
			expect(result.userId).toBe('user-123');
		});
	});

	describe('revokeSession', () => {
		it('clears session from storage', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });
			await session.revokeSession();

			const stored = await mockState.storage.get<Session>('session');
			expect(stored).toBeUndefined();
		});

		it('clears cached session', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });
			await session.revokeSession();

			await expect(session.getSession()).rejects.toThrow('Invalid session');
		});

		it('handles revoking non-existent session', async () => {
			await expect(session.revokeSession()).resolves.not.toThrow();
		});

		it('can save new session after revoke', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-1' });
			await session.revokeSession();

			session.setTime(START_TIME + 5000);
			await session.saveSession(SESSION_ID, { userId: 'user-2' });

			const result = await session.getSession();
			expect(result.userId).toBe('user-2');
		});

		it('multiple revokes do not error', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });
			await session.revokeSession();
			await session.revokeSession();
			await session.revokeSession();

			await expect(session.getSession()).rejects.toThrow('Invalid session');
		});
	});

	describe('WebAuthn challenge flow', () => {
		it('supports challenge creation before authentication', async () => {
			// Step 1: Create session with challenge (pre-auth, no userId yet)
			const withChallenge = await session.saveSession(SESSION_ID, { challenge: 'abc123' });
			expect(withChallenge.challenge).toBe('abc123');
			expect(withChallenge.sessionId).toBe(SESSION_ID);

			// Step 2: Verify challenge is readable
			const read = await session.getSession();
			expect(read.challenge).toBe('abc123');

			// Step 3: Complete auth — upsert into same DO with userId
			session.setTime(START_TIME + 1000);
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			const afterAuth = await session.getSession();
			expect(afterAuth.userId).toBe('user-123');
			expect(afterAuth.sessionId).toBe(SESSION_ID);
		});

		it('challenge-only session can expire', async () => {
			await session.saveSession(SESSION_ID, { challenge: 'abc123' });

			session.clearCache();
			session.setTime(START_TIME + MAX_SESSION_DURATION + 1);

			await expect(session.getSession()).rejects.toThrow('Session expired');
		});
	});

	describe('session lifecycle scenarios', () => {
		it('supports full create-read-revoke cycle', async () => {
			const created = await session.saveSession(SESSION_ID, { userId: 'user-123' });
			expect(created.userId).toBe('user-123');

			const read = await session.getSession();
			expect(read.userId).toBe('user-123');

			await session.revokeSession();

			await expect(session.getSession()).rejects.toThrow('Invalid session');
		});

		it('session survives cache clear if not expired', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			session.clearCache();

			const result = await session.getSession();
			expect(result.userId).toBe('user-123');
		});

		it('repeated access keeps session alive indefinitely', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			const dayInMs = 24 * 60 * 60 * 1000;

			for (let day = 1; day <= 30; day++) {
				session.setTime(START_TIME + day * dayInMs);
				session.clearCache();

				const result = await session.getSession();
				expect(result.userId).toBe('user-123');
			}
		});

		it('inactive session expires after 14 days', async () => {
			await session.saveSession(SESSION_ID, { userId: 'user-123' });

			session.clearCache();
			session.setTime(START_TIME + MAX_SESSION_DURATION + 1);

			await expect(session.getSession()).rejects.toThrow('Session expired');
		});
	});

	describe('edge cases', () => {
		it('handles session with empty string userId', async () => {
			const saved = await session.saveSession(SESSION_ID, { userId: '' });

			expect(saved.userId).toBe('');
		});

		it('handles session with empty string challenge', async () => {
			const saved = await session.saveSession(SESSION_ID, { challenge: '' });

			expect(saved.challenge).toBe('');
		});

		it('handles very long userId', async () => {
			const longId = 'x'.repeat(1000);
			const saved = await session.saveSession(SESSION_ID, { userId: longId });

			expect(saved.userId).toBe(longId);
		});

		it('handles special characters in challenge', async () => {
			const challenge = 'special!@#$%^&*()_+-={}[]|:;<>?,./';
			const saved = await session.saveSession(SESSION_ID, { challenge });

			expect(saved.challenge).toBe(challenge);
		});
	});
});
