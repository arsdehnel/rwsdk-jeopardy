import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNoopLogger } from '@/logger';
import type { KADLogger } from '@/types';

const mockEnv = vi.hoisted(() => ({ RWSDK_JEOPARDY_ENV: 'development' as string }));
const capturedChain = vi.hoisted(() => ({ handlers: [] as unknown[] }));

vi.mock('@/repositories', () => ({
	verifyCategory: vi.fn(),
	verifyClue: vi.fn(),
}));

vi.mock('cloudflare:workers', () => ({
	env: mockEnv,
}));

interface MockRequestInfo {
	ctx: {
		user: { id: string } | null;
		logger: KADLogger;
	};
}

const mockRequestInfo: MockRequestInfo = {
	ctx: {
		user: { id: 'test-user-id' },
		logger: createNoopLogger(),
	},
};

vi.mock('rwsdk/worker', () => ({
	serverAction: (handlers: unknown[]) => {
		capturedChain.handlers = handlers;
		return Array.isArray(handlers) ? handlers[handlers.length - 1] : handlers;
	},
	get requestInfo() {
		return mockRequestInfo;
	},
}));

import { randomUUID } from 'node:crypto';
import { requireAuthentication } from '@/interrupters';
import { verifyCategory, verifyClue } from '@/repositories';
import { _saveVerification } from '../verifications';

const VALID_CATEGORY_ID = randomUUID();
const VALID_CLUE_ID = randomUUID();

const MOCK_CATEGORY_VERIFICATION = {
	id: randomUUID(),
	categoryId: VALID_CATEGORY_ID,
	clueId: null,
	createdAt: new Date().toISOString(),
	createdBy: 'test-user-id',
	updatedAt: null,
	updatedBy: null,
	deletedAt: null,
	deletedBy: null,
};

const MOCK_CLUE_VERIFICATION = {
	id: randomUUID(),
	categoryId: null,
	clueId: VALID_CLUE_ID,
	createdAt: new Date().toISOString(),
	createdBy: 'test-user-id',
	updatedAt: null,
	updatedBy: null,
	deletedAt: null,
	deletedBy: null,
};

const MOCK_CATEGORY = {
	id: VALID_CATEGORY_ID,
	name: 'Science',
	lastVerifiedAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	updatedBy: 'test-user-id',
};

const MOCK_CLUE = {
	id: VALID_CLUE_ID,
	categoryId: VALID_CATEGORY_ID,
	text: 'This element has atomic number 1',
	response: 'What is Hydrogen?',
	lastVerifiedAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	updatedBy: 'test-user-id',
};

describe('saveVerification', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockRequestInfo.ctx.user = { id: 'test-user-id' };
		mockEnv.RWSDK_JEOPARDY_ENV = 'development';

		vi.mocked(verifyCategory).mockResolvedValue({
			verification: MOCK_CATEGORY_VERIFICATION,
			category: MOCK_CATEGORY,
		} as never);

		vi.mocked(verifyClue).mockResolvedValue({
			verification: MOCK_CLUE_VERIFICATION,
			clue: MOCK_CLUE,
		} as never);
	});

	describe('middleware chain', () => {
		it('includes requireAuthentication in the serverAction chain', () => {
			expect(capturedChain.handlers).toContain(requireAuthentication);
		});

		it('includes a requirePermissions handler in the chain', () => {
			const nonTerminal = capturedChain.handlers.slice(0, -1);
			expect(nonTerminal.length).toBeGreaterThanOrEqual(2);
			expect(nonTerminal.some(h => typeof h === 'function')).toBe(true);
		});
	});

	describe('category verification', () => {
		it('creates a category verification when categoryId is provided', async () => {
			const result = await _saveVerification({ categoryId: VALID_CATEGORY_ID });

			expect(result.success).toBe(true);
			expect(verifyCategory).toHaveBeenCalledTimes(1);
			expect(verifyCategory).toHaveBeenCalledWith(VALID_CATEGORY_ID, 'test-user-id', expect.anything());
		});

		it('returns the verification record on success', async () => {
			const result = await _saveVerification({ categoryId: VALID_CATEGORY_ID });

			expect(result.success).toBe(true);
			expect(result.data).toEqual(MOCK_CATEGORY_VERIFICATION);
		});

		it('does not call verifyClue when categoryId is provided', async () => {
			await _saveVerification({ categoryId: VALID_CATEGORY_ID });

			expect(verifyClue).not.toHaveBeenCalled();
		});
	});

	describe('clue verification', () => {
		it('creates a clue verification when clueId is provided', async () => {
			const result = await _saveVerification({ clueId: VALID_CLUE_ID });

			expect(result.success).toBe(true);
			expect(verifyClue).toHaveBeenCalledTimes(1);
			expect(verifyClue).toHaveBeenCalledWith(VALID_CLUE_ID, 'test-user-id', expect.anything());
		});

		it('returns the verification record on success', async () => {
			const result = await _saveVerification({ clueId: VALID_CLUE_ID });

			expect(result.success).toBe(true);
			expect(result.data).toEqual(MOCK_CLUE_VERIFICATION);
		});

		it('does not call verifyCategory when clueId is provided', async () => {
			await _saveVerification({ clueId: VALID_CLUE_ID });

			expect(verifyCategory).not.toHaveBeenCalled();
		});
	});

	describe('validation', () => {
		it('returns error when id is provided (update not implemented)', async () => {
			const result = await _saveVerification({ id: randomUUID(), categoryId: VALID_CATEGORY_ID });

			expect(result.success).toBe(false);
			expect(verifyCategory).not.toHaveBeenCalled();
			expect(verifyClue).not.toHaveBeenCalled();
		});

		it('returns 400 code when id is provided', async () => {
			const result = await _saveVerification({ id: randomUUID(), categoryId: VALID_CATEGORY_ID });

			expect(result.code).toBe(400);
		});

		it('returns error when neither categoryId nor clueId is provided', async () => {
			const result = await _saveVerification({});

			expect(result.success).toBe(false);
			expect(verifyCategory).not.toHaveBeenCalled();
			expect(verifyClue).not.toHaveBeenCalled();
		});

		it('returns 400 code when neither id field is provided', async () => {
			const result = await _saveVerification({});

			expect(result.code).toBe(400);
		});

		it('returns error when categoryId is not a valid UUID', async () => {
			const result = await _saveVerification({ categoryId: 'not-a-uuid' });

			expect(result.success).toBe(false);
			expect(result.errors?.categoryId).toBeDefined();
			expect(verifyCategory).not.toHaveBeenCalled();
		});

		it('returns error when clueId is not a valid UUID', async () => {
			const result = await _saveVerification({ clueId: 'not-a-uuid' });

			expect(result.success).toBe(false);
			expect(result.errors?.clueId).toBeDefined();
			expect(verifyClue).not.toHaveBeenCalled();
		});

		it('returns error when provided id is not a valid UUID', async () => {
			const result = await _saveVerification({ id: 'not-a-uuid', categoryId: VALID_CATEGORY_ID });

			expect(result.success).toBe(false);
			expect(result.errors?.id).toBeDefined();
		});

		it('accepts null categoryId (treated as absent)', async () => {
			// optionalUuid coerces null to undefined, so it's treated as not provided
			await _saveVerification({ categoryId: null });

			expect(verifyCategory).not.toHaveBeenCalled();
			expect(verifyClue).not.toHaveBeenCalled();
		});

		it('returns error when both categoryId and clueId are provided', async () => {
			const result = await _saveVerification({ categoryId: VALID_CATEGORY_ID, clueId: VALID_CLUE_ID });

			expect(result.success).toBe(false);
			expect(result.code).toBe(400);
			expect(verifyCategory).not.toHaveBeenCalled();
			expect(verifyClue).not.toHaveBeenCalled();
		});
	});

	describe('error handling', () => {
		it('returns error response when verifyCategory throws', async () => {
			vi.mocked(verifyCategory).mockRejectedValueOnce(new Error('DB error'));

			const result = await _saveVerification({ categoryId: VALID_CATEGORY_ID });

			expect(result.success).toBe(false);
			expect(result.errors?._form).toBeDefined();
		});

		it('returns error response when verifyClue throws', async () => {
			vi.mocked(verifyClue).mockRejectedValueOnce(new Error('DB error'));

			const result = await _saveVerification({ clueId: VALID_CLUE_ID });

			expect(result.success).toBe(false);
			expect(result.errors?._form).toBeDefined();
		});

		it('returns 500 code when repository throws', async () => {
			vi.mocked(verifyCategory).mockRejectedValueOnce(new Error('DB error'));

			const result = await _saveVerification({ categoryId: VALID_CATEGORY_ID });

			expect(result.code).toBe(500);
		});

		it('surfaces the raw error message in dev mode', async () => {
			vi.mocked(verifyCategory).mockRejectedValueOnce(new Error('DB error'));
			mockEnv.RWSDK_JEOPARDY_ENV = 'development';

			const result = await _saveVerification({ categoryId: VALID_CATEGORY_ID });

			expect(result.errors?._form?.[0]).toBe('DB error');
		});

		it('returns only the static message in production (no internal detail)', async () => {
			vi.mocked(verifyCategory).mockRejectedValueOnce(new Error('Connection failed: postgres://user:password@db.internal'));
			mockEnv.RWSDK_JEOPARDY_ENV = 'production';

			const result = await _saveVerification({ categoryId: VALID_CATEGORY_ID });

			expect(result.errors?._form?.[0]).toBe('Failed to save verification');
			expect(result.errors?._form?.[0]).not.toContain('password');
		});
	});
});
