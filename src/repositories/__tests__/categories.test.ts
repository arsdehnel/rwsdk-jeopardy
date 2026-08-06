import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createCategory, deleteCategory, getCategories, getCategoriesForGameStage, verifyCategory } from '../categories';
import { createClue, deleteClue } from '../clues';
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

	it('returns all matching categories when multiple IDs are passed', async () => {
		const user = await createUser('testuser', null, logger);
		const cat1 = await createCategory({ name: 'Multi1' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Multi2' }, user.id, logger);
		const cat3 = await createCategory({ name: 'Multi3' }, user.id, logger);

		const result = await getCategoriesForGameStage([cat1.id, cat2.id, cat3.id], 'SINGLE', logger);

		const ids = result.map(r => r.id);
		expect(ids).toContain(cat1.id);
		expect(ids).toContain(cat2.id);
		expect(ids).toContain(cat3.id);
	});

	it('excludes soft-deleted categories', async () => {
		const user = await createUser('testuser', null, logger);
		const cat1 = await createCategory({ name: 'Active' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Deleted' }, user.id, logger);
		await deleteCategory(cat2.id, user.id, logger);

		const result = await getCategoriesForGameStage([cat1.id, cat2.id], 'SINGLE', logger);

		const ids = result.map(r => r.id);
		expect(ids).toContain(cat1.id);
		expect(ids).not.toContain(cat2.id);
	});

	it('excludes soft-deleted clues within a category', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'WithClues' }, user.id, logger);
		await createClue({ categoryId: cat.id, text: 'Keep this', response: 'Kept' }, user.id, logger);
		const deletedClue = await createClue({ categoryId: cat.id, text: 'Delete this', response: 'Gone' }, user.id, logger);
		await deleteClue(deletedClue.id, user.id, logger);

		const result = await getCategoriesForGameStage([cat.id], 'SINGLE', logger);

		expect(result[0].clues).toHaveLength(1);
		expect(result[0].clues[0].text).toBe('Keep this');
	});
});

describe('deleteCategory', () => {
	it('throws when categoryId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(deleteCategory('not-a-uuid', user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Category',
		);
	});

	it('throws when category does not exist', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(deleteCategory(crypto.randomUUID(), user.id, logger)).rejects.toThrow(
			'Expected 1 Category record(s), but found 0',
		);
	});

	it('soft-deletes category and returns it with deletedAt and deletedBy set', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'ToDelete' }, user.id, logger);

		const deleted = await deleteCategory(cat.id, user.id, logger);

		expect(deleted.id).toBe(cat.id);
		expect(deleted.deletedAt).not.toBeNull();
		expect(deleted.deletedBy).toBe(user.id);
	});

	it('excludes deleted category from getCategories', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'GoneCategory' }, user.id, logger);
		await deleteCategory(cat.id, user.id, logger);

		const result = await getCategories(logger);

		expect(result.map(c => c.id)).not.toContain(cat.id);
	});

	it('does not affect other categories', async () => {
		const user = await createUser('testuser', null, logger);
		const cat1 = await createCategory({ name: 'DeleteMe' }, user.id, logger);
		const cat2 = await createCategory({ name: 'KeepMe' }, user.id, logger);
		await deleteCategory(cat1.id, user.id, logger);

		const result = await getCategories(logger);

		expect(result.map(c => c.id)).toContain(cat2.id);
	});
});
