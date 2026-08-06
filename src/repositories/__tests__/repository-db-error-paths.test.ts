import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNoopLogger } from '@/logger';

vi.mock('@/db', () => ({
	default: {
		insert: vi.fn(),
		query: {
			games: {
				findFirst: vi.fn(),
			},
		},
		select: vi.fn(),
	},
}));

import db from '@/db';
import { createCategory } from '../categories';
import { createClue } from '../clues';
import { createGameStageCategory } from '../game-stage-categories';
import { createGameStage } from '../game-stages';
import { createGame, getGameById } from '../games';
import { getUserById } from '../users';

const logger = createNoopLogger();

beforeEach(() => {
	vi.resetAllMocks();
});

describe('getUserById catch block', () => {
	it('rethrows when db.select throws synchronously', async () => {
		vi.mocked(db.select).mockImplementationOnce(() => {
			throw new Error('DB failure');
		});

		await expect(getUserById(crypto.randomUUID(), logger)).rejects.toThrow('DB failure');
	});
});

describe('getGameById catch block', () => {
	it('rethrows when db.query.games.findFirst rejects', async () => {
		vi.mocked((db as any).query.games.findFirst).mockRejectedValueOnce(new Error('DB failure'));

		await expect(getGameById(crypto.randomUUID(), logger)).rejects.toThrow('DB failure');
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

describe('createGameStage insert-returns-0', () => {
	it('throws UnexpectedRecordCount when insert returns empty array', async () => {
		vi.mocked(db.insert).mockReturnValueOnce({
			values: vi.fn().mockReturnValue({
				returning: vi.fn().mockResolvedValue([]),
			}),
		} as any);

		await expect(createGameStage({ stage: 'SINGLE' }, crypto.randomUUID(), crypto.randomUUID(), logger)).rejects.toThrow(
			'Expected 1 Game Stage record(s), but found 0',
		);
	});
});

describe('createGameStageCategory insert-returns-0', () => {
	it('throws UnexpectedRecordCount when insert returns empty array', async () => {
		vi.mocked(db.insert).mockReturnValueOnce({
			values: vi.fn().mockReturnValue({
				returning: vi.fn().mockResolvedValue([]),
			}),
		} as any);

		await expect(
			createGameStageCategory({ categoryId: crypto.randomUUID(), position: 0 }, crypto.randomUUID(), crypto.randomUUID(), logger),
		).rejects.toThrow('Expected 1 Game Stage Category record(s), but found 0');
	});
});

describe('createCategory insert-returns-0', () => {
	it('throws UnexpectedRecordCount when insert returns empty array', async () => {
		vi.mocked(db.insert).mockReturnValueOnce({
			values: vi.fn().mockReturnValue({
				returning: vi.fn().mockResolvedValue([]),
			}),
		} as any);

		await expect(createCategory({ name: 'Science' }, crypto.randomUUID(), logger)).rejects.toThrow(
			'Expected 1 Category record(s), but found 0',
		);
	});
});

describe('createClue insert-returns-0', () => {
	it('throws UnexpectedRecordCount when insert returns empty array', async () => {
		vi.mocked(db.insert).mockReturnValueOnce({
			values: vi.fn().mockReturnValue({
				returning: vi.fn().mockResolvedValue([]),
			}),
		} as any);

		await expect(
			createClue({ categoryId: crypto.randomUUID(), text: 'Some clue', response: 'Some response' }, crypto.randomUUID(), logger),
		).rejects.toThrow('Expected 1 Clue record(s), but found 0');
	});
});
