import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createCategory } from '../categories';
import { createClue, deleteClue, getClueById, getCluesByCategoryId, updateClue, verifyClue } from '../clues';
import { createUser } from '../users';

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('createClue', () => {
	it('creates a clue and returns it', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);

		const clue = await createClue(
			{ categoryId: cat.id, text: 'This element has atomic number 1', response: 'What is Hydrogen?' },
			user.id,
			logger,
		);

		expect(clue.id).toBeDefined();
		expect(clue.text).toBe('This element has atomic number 1');
		expect(clue.response).toBe('What is Hydrogen?');
		expect(clue.categoryId).toBe(cat.id);
	});
});

describe('verifyClue', () => {
	it('throws when clueId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(verifyClue('not-a-uuid', user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Clue',
		);
	});

	it('returns updated clue and verification record on success', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Geography' }, user.id, logger);
		const clue = await createClue(
			{ categoryId: cat.id, text: 'The capital of France', response: 'What is Paris?' },
			user.id,
			logger,
		);

		const result = await verifyClue(clue.id, user.id, logger);

		expect(result.clue.id).toBe(clue.id);
		expect(result.clue.lastVerifiedAt).not.toBeNull();
		expect(result.verification.clueId).toBe(clue.id);
	});
});

describe('getCluesByCategoryId', () => {
	it('throws when categoryId is not a valid UUID', async () => {
		await expect(getCluesByCategoryId('not-a-uuid', logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Category',
		);
	});

	it('returns empty array when category has no clues', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Empty' }, user.id, logger);

		const result = await getCluesByCategoryId(cat.id, logger);

		expect(result).toEqual([]);
	});

	it('returns clues for the given category', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);
		const clue1 = await createClue({ categoryId: cat.id, text: 'Q1', response: 'A1' }, user.id, logger);
		const clue2 = await createClue({ categoryId: cat.id, text: 'Q2', response: 'A2' }, user.id, logger);

		const result = await getCluesByCategoryId(cat.id, logger);

		expect(result).toHaveLength(2);
		const ids = result.map(c => c.id);
		expect(ids).toContain(clue1.id);
		expect(ids).toContain(clue2.id);
	});

	it('does not return clues from other categories', async () => {
		const user = await createUser('testuser', null, logger);
		const cat1 = await createCategory({ name: 'Cat1' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Cat2' }, user.id, logger);
		await createClue({ categoryId: cat1.id, text: 'Other', response: 'Other' }, user.id, logger);
		const clue2 = await createClue({ categoryId: cat2.id, text: 'Mine', response: 'Mine' }, user.id, logger);

		const result = await getCluesByCategoryId(cat2.id, logger);

		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(clue2.id);
	});

	it('excludes soft-deleted clues', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'History' }, user.id, logger);
		const clue1 = await createClue({ categoryId: cat.id, text: 'Keep', response: 'Kept' }, user.id, logger);
		const clue2 = await createClue({ categoryId: cat.id, text: 'Delete', response: 'Gone' }, user.id, logger);
		await deleteClue(clue2.id, user.id, logger);

		const result = await getCluesByCategoryId(cat.id, logger);

		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(clue1.id);
	});

	it('returns clues with their verifications', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Geography' }, user.id, logger);
		const clue = await createClue({ categoryId: cat.id, text: 'Capital of France', response: 'Paris' }, user.id, logger);
		await verifyClue(clue.id, user.id, logger);

		const result = await getCluesByCategoryId(cat.id, logger);

		expect(result[0].verifications).toHaveLength(1);
		expect(result[0].verifications[0].clueId).toBe(clue.id);
	});

	it('returns clues with empty verifications array when none exist', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Music' }, user.id, logger);
		await createClue({ categoryId: cat.id, text: 'Q', response: 'A' }, user.id, logger);

		const result = await getCluesByCategoryId(cat.id, logger);

		expect(result[0].verifications).toEqual([]);
	});
});

describe('getClueById', () => {
	it('throws when clueId is not a valid UUID', async () => {
		await expect(getClueById('not-a-uuid', logger)).rejects.toThrow('The value "not-a-uuid" is not a valid ID for a Clue');
	});

	it('throws when clue does not exist', async () => {
		await expect(getClueById(crypto.randomUUID(), logger)).rejects.toThrow('Expected 1 Clue record(s), but found 0');
	});

	it('returns clue with its verifications', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);
		const clue = await createClue({ categoryId: cat.id, text: 'Q', response: 'A' }, user.id, logger);
		await verifyClue(clue.id, user.id, logger);

		const result = await getClueById(clue.id, logger);

		expect(result.id).toBe(clue.id);
		expect(result.text).toBe('Q');
		expect(result.verifications).toHaveLength(1);
		expect(result.verifications[0].clueId).toBe(clue.id);
	});

	it('returns clue with empty verifications array when none exist', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'History' }, user.id, logger);
		const clue = await createClue({ categoryId: cat.id, text: 'Q', response: 'A' }, user.id, logger);

		const result = await getClueById(clue.id, logger);

		expect(result.verifications).toEqual([]);
	});

	it('throws when clue is soft-deleted', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Art' }, user.id, logger);
		const clue = await createClue({ categoryId: cat.id, text: 'Q', response: 'A' }, user.id, logger);
		await deleteClue(clue.id, user.id, logger);

		await expect(getClueById(clue.id, logger)).rejects.toThrow('Expected 1 Clue record(s), but found 0');
	});

	it('returns correct clue when multiple exist', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Geography' }, user.id, logger);
		await createClue({ categoryId: cat.id, text: 'Other', response: 'Other' }, user.id, logger);
		const target = await createClue({ categoryId: cat.id, text: 'Target', response: 'Target' }, user.id, logger);
		await createClue({ categoryId: cat.id, text: 'Another', response: 'Another' }, user.id, logger);

		const result = await getClueById(target.id, logger);

		expect(result.id).toBe(target.id);
		expect(result.text).toBe('Target');
	});
});

describe('updateClue', () => {
	it('throws when clueId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(
			updateClue('not-a-uuid', { categoryId: crypto.randomUUID(), text: 'Q', response: 'A' }, user.id, logger),
		).rejects.toThrow('The value "not-a-uuid" is not a valid ID for a Clue');
	});

	it('throws when clue does not exist', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);

		await expect(
			updateClue(crypto.randomUUID(), { categoryId: cat.id, text: 'Q', response: 'A' }, user.id, logger),
		).rejects.toThrow('Expected 1 Clue record(s), but found 0');
	});

	it('updates text and response and returns the updated clue', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);
		const clue = await createClue({ categoryId: cat.id, text: 'Old text', response: 'Old response' }, user.id, logger);

		const updated = await updateClue(
			clue.id,
			{ categoryId: cat.id, text: 'New text', response: 'New response' },
			user.id,
			logger,
		);

		expect(updated.id).toBe(clue.id);
		expect(updated.text).toBe('New text');
		expect(updated.response).toBe('New response');
	});

	it('sets updatedBy to the userId', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);
		const clue = await createClue({ categoryId: cat.id, text: 'Q', response: 'A' }, user.id, logger);

		const updated = await updateClue(clue.id, { categoryId: cat.id, text: 'Q2', response: 'A2' }, user.id, logger);

		expect(updated.updatedBy).toBe(user.id);
		expect(updated.updatedAt).not.toBeNull();
	});

	it('does not affect sibling clues in the same category', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'History' }, user.id, logger);
		const clue1 = await createClue({ categoryId: cat.id, text: 'Q1', response: 'A1' }, user.id, logger);
		const clue2 = await createClue({ categoryId: cat.id, text: 'Q2', response: 'A2' }, user.id, logger);

		await updateClue(clue1.id, { categoryId: cat.id, text: 'Updated Q1', response: 'Updated A1' }, user.id, logger);

		const unchanged = await getClueById(clue2.id, logger);
		expect(unchanged.text).toBe('Q2');
		expect(unchanged.response).toBe('A2');
	});
});

describe('deleteClue', () => {
	it('throws when clueId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(deleteClue('not-a-uuid', user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Clue',
		);
	});

	it('throws when clue does not exist', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(deleteClue(crypto.randomUUID(), user.id, logger)).rejects.toThrow('Expected 1 Clue record(s), but found 0');
	});

	it('soft-deletes clue and returns it with deletedAt and deletedBy set', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);
		const clue = await createClue({ categoryId: cat.id, text: 'Q', response: 'A' }, user.id, logger);

		const deleted = await deleteClue(clue.id, user.id, logger);

		expect(deleted.id).toBe(clue.id);
		expect(deleted.deletedAt).not.toBeNull();
		expect(deleted.deletedBy).toBe(user.id);
	});

	it('does not affect sibling clues in the same category', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'History' }, user.id, logger);
		const clue1 = await createClue({ categoryId: cat.id, text: 'Keep', response: 'Kept' }, user.id, logger);
		const clue2 = await createClue({ categoryId: cat.id, text: 'Delete', response: 'Gone' }, user.id, logger);
		await deleteClue(clue2.id, user.id, logger);

		// verifyClue on the surviving clue should still work
		const result = await verifyClue(clue1.id, user.id, logger);
		expect(result.clue.id).toBe(clue1.id);
	});
});
