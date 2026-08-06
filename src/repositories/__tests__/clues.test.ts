import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createCategory } from '../categories';
import { createClue, deleteClue, verifyClue } from '../clues';
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
		const cat = await createCategory({ name: 'History' }, user.id, logger);

		await expect(verifyClue('not-a-uuid', cat.id, user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Clue',
		);
	});

	it('throws when categoryId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(verifyClue(crypto.randomUUID(), 'not-a-uuid', user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Category',
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

		const result = await verifyClue(clue.id, cat.id, user.id, logger);

		expect(result.clue.id).toBe(clue.id);
		expect(result.clue.lastVerifiedAt).not.toBeNull();
		expect(result.verification.clueId).toBe(clue.id);
		expect(result.verification.categoryId).toBe(cat.id);
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
		const result = await verifyClue(clue1.id, cat.id, user.id, logger);
		expect(result.clue.id).toBe(clue1.id);
	});
});
