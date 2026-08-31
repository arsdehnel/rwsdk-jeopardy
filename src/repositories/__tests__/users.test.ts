import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNoopLogger } from '@/logger';

vi.mock('@/db', () => ({
	default: {
		select: vi.fn(),
	},
}));

import db from '@/db';
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
