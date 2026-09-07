import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNoopLogger } from '@/logger';

vi.mock('@/db', () => ({
	default: {
		insert: vi.fn(),
		update: vi.fn(),
	},
}));

import db from '@/db';
import { createCategory, updateCategory } from '../categories';

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

describe('updateCategory', () => {
	it('throws InvalidUUID when categoryId is not a valid UUID', async () => {
		await expect(updateCategory('not-a-uuid', { name: 'New Name' }, crypto.randomUUID(), logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Category',
		);
	});

	it('throws UnexpectedRecordCount when update returns empty array', async () => {
		vi.mocked(db.update).mockReturnValueOnce({
			set: vi.fn().mockReturnValue({
				where: vi.fn().mockReturnValue({
					returning: vi.fn().mockResolvedValue([]),
				}),
			}),
		} as any);

		await expect(updateCategory(crypto.randomUUID(), { name: 'New Name' }, crypto.randomUUID(), logger)).rejects.toThrow(
			'Expected 1 Category record(s), but found 0',
		);
	});
});
