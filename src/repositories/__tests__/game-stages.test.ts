import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNoopLogger } from '@/logger';

vi.mock('@/db', () => ({
	default: {
		insert: vi.fn(),
	},
}));

import db from '@/db';
import { createGameStage } from '../game-stages';

const logger = createNoopLogger();

beforeEach(() => {
	vi.resetAllMocks();
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
