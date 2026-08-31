import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNoopLogger } from '@/logger';

vi.mock('@/db', () => ({
	default: {
		insert: vi.fn(),
	},
}));

import db from '@/db';
import { createCategory } from '../categories';

const logger = createNoopLogger();

beforeEach(() => {
	vi.resetAllMocks();
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
