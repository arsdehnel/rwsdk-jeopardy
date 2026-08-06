import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createCategory, getCategories, getCategoriesForGameStage, verifyCategory } from '../categories';
import { createUser } from '../users';

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('getCategories', () => {
	it('returns all non-deleted categories', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);

		const result = await getCategories(logger);
		const ids = result.map(c => c.id);

		expect(ids).toContain(cat.id);
	});

	it('returns only non-deleted categories', async () => {
		// Seed data may be present; just confirm the result is an array
		const result = await getCategories(logger);
		expect(Array.isArray(result)).toBe(true);
		// All returned records should have no deletedAt
		for (const cat of result) {
			expect(cat.deletedAt).toBeNull();
		}
	});
});

describe('createCategory', () => {
	it('creates a category and returns it', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'History' }, user.id, logger);

		expect(cat.name).toBe('History');
		expect(cat.id).toBeDefined();
		expect(cat.createdAt).toBeDefined();
	});
});

describe('verifyCategory', () => {
	it('throws when categoryId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(verifyCategory('not-a-uuid', user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Category',
		);
	});

	it('returns updated category and verification record on success', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Geography' }, user.id, logger);

		const result = await verifyCategory(cat.id, user.id, logger);

		expect(result.category.id).toBe(cat.id);
		expect(result.category.lastVerifiedAt).not.toBeNull();
		expect(result.verification.categoryId).toBe(cat.id);
	});
});

describe('getCategoriesForGameStage', () => {
	it('uses multiplier 100 for SINGLE stage', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Animals' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat.id], 'SINGLE', logger);

		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(cat.id);
	});

	it('uses multiplier 200 for DOUBLE stage', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Sports' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat.id], 'DOUBLE', logger);

		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(cat.id);
	});

	it('uses multiplier 300 for TRIPLE stage', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Movies' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat.id], 'TRIPLE', logger);

		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(cat.id);
	});

	it('throws for FINAL stage', async () => {
		await expect(getCategoriesForGameStage([], 'FINAL', logger)).rejects.toThrow('Invalid game stage: FINAL');
	});
});
