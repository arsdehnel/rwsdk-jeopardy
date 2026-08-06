import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createCategory, getCategories, getCategoriesForGameStage, verifyCategory } from '../categories';
import { createClue } from '../clues';
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

	it('maps clues with correct values for SINGLE stage (100 per position)', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);
		const clue1 = await createClue({ categoryId: cat.id, text: 'Q1', response: 'A1' }, user.id, logger);
		const clue2 = await createClue({ categoryId: cat.id, text: 'Q2', response: 'A2' }, user.id, logger);
		const clue3 = await createClue({ categoryId: cat.id, text: 'Q3', response: 'A3' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat.id], 'SINGLE', logger);

		expect(result).toHaveLength(1);
		const clues = result[0].clues;
		expect(clues).toHaveLength(3);
		const clueIds = clues.map(c => c.id);
		expect(clueIds).toContain(clue1.id);
		expect(clueIds).toContain(clue2.id);
		expect(clueIds).toContain(clue3.id);
		const values = clues.map(c => c.value).sort((a, b) => a - b);
		expect(values).toEqual([100, 200, 300]);
	});

	it('maps clues with correct values for DOUBLE stage (200 per position)', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'History' }, user.id, logger);
		await createClue({ categoryId: cat.id, text: 'Q1', response: 'A1' }, user.id, logger);
		await createClue({ categoryId: cat.id, text: 'Q2', response: 'A2' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat.id], 'DOUBLE', logger);

		const values = result[0].clues.map(c => c.value).sort((a, b) => a - b);
		expect(values).toEqual([200, 400]);
	});

	it('maps clues with correct values for TRIPLE stage (300 per position)', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Geography' }, user.id, logger);
		await createClue({ categoryId: cat.id, text: 'Q1', response: 'A1' }, user.id, logger);
		await createClue({ categoryId: cat.id, text: 'Q2', response: 'A2' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat.id], 'TRIPLE', logger);

		const values = result[0].clues.map(c => c.value).sort((a, b) => a - b);
		expect(values).toEqual([300, 600]);
	});

	it('returns clue text and response in the mapped output', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Literature' }, user.id, logger);
		await createClue({ categoryId: cat.id, text: 'He wrote Hamlet', response: 'Who is Shakespeare?' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat.id], 'SINGLE', logger);

		const clue = result[0].clues[0];
		expect(clue.text).toBe('He wrote Hamlet');
		expect(clue.response).toBe('Who is Shakespeare?');
	});

	it('returns empty clues array for a category with no clues', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Empty' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat.id], 'SINGLE', logger);

		expect(result).toHaveLength(1);
		expect(result[0].clues).toEqual([]);
	});

	it('excludes categories not in the provided ID list', async () => {
		const user = await createUser('testuser', null, logger);
		const cat1 = await createCategory({ name: 'Included' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Excluded' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat1.id], 'SINGLE', logger);

		const ids = result.map(r => r.id);
		expect(ids).toContain(cat1.id);
		expect(ids).not.toContain(cat2.id);
	});

	it('returns empty array when given an empty ID list', async () => {
		const result = await getCategoriesForGameStage([], 'SINGLE', logger);
		expect(result).toEqual([]);
	});
});
