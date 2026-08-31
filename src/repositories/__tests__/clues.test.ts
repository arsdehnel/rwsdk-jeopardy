import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNoopLogger } from '@/logger';

vi.mock('@/db', () => ({
	default: {
		insert: vi.fn(),
	},
}));

import db from '@/db';
import { createClue } from '../clues';

const logger = createNoopLogger();

beforeEach(() => {
	vi.resetAllMocks();
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
