import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createGame, deleteGame, getGameById, getGamesByOwnerId, updateGame } from '../games';
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

	it('throws when userId is not a valid UUID', async () => {
		await expect(updateGame(crypto.randomUUID(), {}, 'not-a-uuid', logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a User ID',
		);
	});

	it('throws when hostUserId is present but not a valid UUID', async () => {
		await expect(updateGame(crypto.randomUUID(), { hostUserId: 'not-a-uuid' }, crypto.randomUUID(), logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Host',
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

	it('excludes soft-deleted games', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		await deleteGame(game.id, user.id, logger);

		const result = await getGamesByOwnerId(user.id, logger);

		expect(result.map(g => g.id)).not.toContain(game.id);
	});
});

describe('deleteGame', () => {
	it('throws when gameId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(deleteGame('not-a-uuid', user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Game',
		);
	});

	it('throws when game does not exist', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(deleteGame(crypto.randomUUID(), user.id, logger)).rejects.toThrow('Expected 1 Game record(s), but found 0');
	});

	it('soft-deletes game and returns it with deletedAt and deletedBy set', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);

		const deleted = await deleteGame(game.id, user.id, logger);

		expect(deleted.id).toBe(game.id);
		expect(deleted.deletedAt).not.toBeNull();
		expect(deleted.deletedBy).toBe(user.id);
	});

	it('excluded from getGameById after deletion', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		await deleteGame(game.id, user.id, logger);

		await expect(getGameById(game.id, logger)).rejects.toThrow('Expected 1 Game record(s), but found 0');
	});

	it('does not affect other games', async () => {
		const user = await createUser('testuser', null, logger);
		const game1 = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		const game2 = await createGame({ ownerId: user.id, currentStage: 'DOUBLE' }, user.id, logger);
		await deleteGame(game1.id, user.id, logger);

		const result = await getGamesByOwnerId(user.id, logger);

		expect(result.map(g => g.id)).toContain(game2.id);
		expect(result.map(g => g.id)).not.toContain(game1.id);
	});
});
