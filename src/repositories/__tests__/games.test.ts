import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createGame, getGameById, getGamesByOwnerId, updateGame } from '../games';
import { createUser } from '../users';

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('createGame', () => {
	it('creates a game and returns it', async () => {
		const user = await createUser('testuser', null, logger);

		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);

		expect(game.id).toBeDefined();
		expect(game.ownerId).toBe(user.id);
		expect(game.currentStage).toBe('SINGLE');
		expect(game.phase).toBe('SETUP');
	});
});

describe('updateGame', () => {
	it('throws when gameId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(updateGame('not-a-uuid', { ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Game',
		);
	});

	it('throws when game is not found in the DB', async () => {
		const user = await createUser('testuser', null, logger);
		const nonExistentId = crypto.randomUUID();

		await expect(updateGame(nonExistentId, { ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger)).rejects.toThrow(
			'Expected 1 Game record(s), but found 0',
		);
	});

	it('updates a game and returns the updated record', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);

		const updated = await updateGame(game.id, { ownerId: user.id, currentStage: 'DOUBLE' }, user.id, logger);

		expect(updated.id).toBe(game.id);
		expect(updated.currentStage).toBe('DOUBLE');
	});
});

describe('getGameById', () => {
	it('throws when gameId is not a valid UUID', async () => {
		await expect(getGameById('not-a-uuid', logger)).rejects.toThrow('The value "not-a-uuid" is not a valid ID for a Game');
	});

	it('throws when game is not found', async () => {
		const nonExistentId = crypto.randomUUID();

		await expect(getGameById(nonExistentId, logger)).rejects.toThrow('Expected 1 Game record(s), but found 0');
	});

	it('returns game with stages and categories when found', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);

		const result = await getGameById(game.id, logger);

		expect(result.id).toBe(game.id);
		expect(result.stages).toBeDefined();
		expect(Array.isArray(result.stages)).toBe(true);
	});
});

describe('getGamesByOwnerId', () => {
	it('returns games owned by the user', async () => {
		const user = await createUser('testuser', null, logger);
		const game1 = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		const game2 = await createGame({ ownerId: user.id, currentStage: 'DOUBLE' }, user.id, logger);

		const result = await getGamesByOwnerId(user.id, logger);
		const ids = result.map(g => g.id);

		expect(ids).toContain(game1.id);
		expect(ids).toContain(game2.id);
	});

	it('returns empty array when user has no games', async () => {
		const user = await createUser('testuser', null, logger);

		const result = await getGamesByOwnerId(user.id, logger);

		expect(result).toEqual([]);
	});

	it('does not return games owned by another user', async () => {
		const user1 = await createUser('user1', null, logger);
		const user2 = await createUser('user2', null, logger);
		await createGame({ ownerId: user1.id, currentStage: 'SINGLE' }, user1.id, logger);

		const result = await getGamesByOwnerId(user2.id, logger);

		expect(result).toEqual([]);
	});
});
