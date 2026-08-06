import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createCategory } from '../categories';
import { createClue, verifyClue } from '../clues';
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
