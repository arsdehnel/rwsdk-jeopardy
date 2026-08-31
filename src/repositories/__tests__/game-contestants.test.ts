import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNoopLogger } from '@/logger';

vi.mock('@/db', () => ({
	default: {
		select: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		insert: vi.fn(),
	},
}));

import db from '@/db';
import { saveGameContestants, updateContestantScores } from '../game-contestants';

const logger = createNoopLogger();

beforeEach(() => {
	vi.resetAllMocks();
});

describe('saveGameContestants UUID validation', () => {
	it('throws when gameId is not a valid UUID', async () => {
		await expect(saveGameContestants('not-a-uuid', [], crypto.randomUUID(), logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Game',
		);
	});

	it('throws when a contestant has an invalid session ID', async () => {
		await expect(
			saveGameContestants(crypto.randomUUID(), [{ sessionId: 'not-a-uuid', name: 'Alice' }], crypto.randomUUID(), logger),
		).rejects.toThrow();
	});
});

describe('saveGameContestants delete catch block', () => {
	it('rethrows when db.delete rejects while removing a contestant', async () => {
		const existingSessionId = crypto.randomUUID();
		const gameId = crypto.randomUUID();

		vi.mocked(db.select).mockReturnValueOnce({
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([{ id: crypto.randomUUID(), sessionId: existingSessionId, gameId }]),
			}),
		} as any);

		vi.mocked(db.delete).mockReturnValueOnce({
			where: vi.fn().mockRejectedValue(new Error('DB failure')),
		} as any);

		await expect(saveGameContestants(gameId, [], crypto.randomUUID(), logger)).rejects.toThrow('DB failure');
	});
});

describe('saveGameContestants upsert catch block', () => {
	it('rethrows when db.insert rejects while saving a new contestant', async () => {
		const gameId = crypto.randomUUID();
		const sessionId = crypto.randomUUID();

		vi.mocked(db.select).mockReturnValueOnce({
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([]),
			}),
		} as any);

		vi.mocked(db.insert).mockReturnValueOnce({
			values: vi.fn().mockReturnValue({
				returning: vi.fn().mockRejectedValue(new Error('DB failure')),
			}),
		} as any);

		await expect(saveGameContestants(gameId, [{ sessionId, name: 'Alice' }], crypto.randomUUID(), logger)).rejects.toThrow(
			'DB failure',
		);
	});
});

describe('updateContestantScores UUID validation', () => {
	it('throws when gameId is not a valid UUID', async () => {
		await expect(updateContestantScores('not-a-uuid', {}, crypto.randomUUID(), logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Game',
		);
	});

	it('throws when a contestant session ID key is not a valid UUID', async () => {
		vi.mocked(db.select).mockReturnValueOnce({
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([]),
			}),
		} as any);

		await expect(updateContestantScores(crypto.randomUUID(), { 'not-a-uuid': 100 }, crypto.randomUUID(), logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Contestant Session ID',
		);
	});
});

describe('updateContestantScores missing record', () => {
	it('throws when a session ID in the score map has no existing contestant record', async () => {
		const sessionId = crypto.randomUUID();

		vi.mocked(db.select).mockReturnValueOnce({
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([]),
			}),
		} as any);

		await expect(updateContestantScores(crypto.randomUUID(), { [sessionId]: 200 }, crypto.randomUUID(), logger)).rejects.toThrow(
			`No existing record found for session ID ${sessionId}`,
		);
	});
});

describe('updateContestantScores catch block', () => {
	it('rethrows when db.update rejects', async () => {
		const sessionId = crypto.randomUUID();
		const gameId = crypto.randomUUID();

		vi.mocked(db.select).mockReturnValueOnce({
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([{ id: crypto.randomUUID(), sessionId, gameId }]),
			}),
		} as any);

		vi.mocked(db.update).mockReturnValueOnce({
			set: vi.fn().mockReturnValue({
				where: vi.fn().mockReturnValue({
					returning: vi.fn().mockRejectedValue(new Error('DB failure')),
				}),
			}),
		} as any);

		await expect(updateContestantScores(gameId, { [sessionId]: 200 }, crypto.randomUUID(), logger)).rejects.toThrow('DB failure');
	});
});
