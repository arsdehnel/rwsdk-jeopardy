import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createGameStage, updateGameStage } from '../game-stages';
import { createGame } from '../games';
import { createUser } from '../users';

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('createGameStage', () => {
	it('throws when gameId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(createGameStage({ stage: 'SINGLE' }, 'not-a-uuid', user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Game',
		);
	});

	it('creates a game stage and returns it', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);

		const stage = await createGameStage({ stage: 'SINGLE' }, game.id, user.id, logger);

		expect(stage.id).toBeDefined();
		expect(stage.gameId).toBe(game.id);
		expect(stage.stage).toBe('SINGLE');
	});
});

describe('updateGameStage', () => {
	it('throws when gameStageId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);

		await expect(updateGameStage('not-a-uuid', { stage: 'DOUBLE' }, user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Game Stage',
		);
	});

	it('throws when game stage is not found in the DB', async () => {
		const user = await createUser('testuser', null, logger);
		const nonExistentId = crypto.randomUUID();

		await expect(updateGameStage(nonExistentId, { stage: 'DOUBLE' }, user.id, logger)).rejects.toThrow(
			'Expected 1 Game Stage record(s), but found 0',
		);
	});

	it('updates a game stage and returns the updated record', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		const stage = await createGameStage({ stage: 'SINGLE' }, game.id, user.id, logger);

		const updated = await updateGameStage(stage.id, { stage: 'DOUBLE' }, user.id, logger);

		expect(updated.id).toBe(stage.id);
		expect(updated.stage).toBe('DOUBLE');
	});
});
