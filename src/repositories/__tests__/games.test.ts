import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNoopLogger } from '@/logger';

vi.mock('@/db', () => ({
	default: {
		insert: vi.fn(),
		update: vi.fn(),
		query: {
			games: {
				findFirst: vi.fn(),
			},
		},
	},
}));

import db from '@/db';
import { createGame, getGameById, updateGame } from '../games';

const logger = createNoopLogger();

beforeEach(() => {
	vi.resetAllMocks();
});

describe('getGameById catch block', () => {
	it('rethrows when db.query.games.findFirst rejects', async () => {
		vi.mocked((db as any).query.games.findFirst).mockRejectedValueOnce(new Error('DB failure'));

		await expect(getGameById(crypto.randomUUID(), logger)).rejects.toThrow('DB failure');
	});
});

describe('updateGame catch block', () => {
	it('rethrows when db.update rejects', async () => {
		vi.mocked(db.update).mockReturnValueOnce({
			set: vi.fn().mockReturnValue({
				where: vi.fn().mockReturnValue({
					returning: vi.fn().mockRejectedValue(new Error('DB failure')),
				}),
			}),
		} as any);

		await expect(updateGame(crypto.randomUUID(), {}, crypto.randomUUID(), logger)).rejects.toThrow('DB failure');
	});
});

describe('createGame insert-returns-0', () => {
	it('throws UnexpectedRecordCount when insert returns empty array', async () => {
		vi.mocked(db.insert).mockReturnValueOnce({
			values: vi.fn().mockReturnValue({
				returning: vi.fn().mockResolvedValue([]),
			}),
		} as any);

		await expect(
			createGame({ ownerId: crypto.randomUUID(), currentStage: 'SINGLE' }, crypto.randomUUID(), logger),
		).rejects.toThrow('Expected 1 Game record(s), but found 0');
	});
});
