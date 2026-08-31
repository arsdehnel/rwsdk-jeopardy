import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { saveGameContestants, updateContestantScores } from '../game-contestants';
import { createGame } from '../games';
import { createUser } from '../users';

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('saveGameContestants', () => {
	it('inserts new contestants and returns them', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		const sessionId = crypto.randomUUID();

		const result = await saveGameContestants(game.id, [{ sessionId, name: 'Alice' }], user.id, logger);

		expect(result).toHaveLength(1);
		expect(result[0].sessionId).toBe(sessionId);
		expect(result[0].name).toBe('Alice');
	});

	it('updates an existing contestant when called again with the same session ID', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		const sessionId = crypto.randomUUID();

		await saveGameContestants(game.id, [{ sessionId, name: 'Alice' }], user.id, logger);
		const result = await saveGameContestants(game.id, [{ sessionId, name: 'Alice Updated' }], user.id, logger);

		expect(result).toHaveLength(1);
		expect(result[0].sessionId).toBe(sessionId);
		expect(result[0].name).toBe('Alice Updated');
	});

	it('removes a contestant that is no longer in the list', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		const session1 = crypto.randomUUID();
		const session2 = crypto.randomUUID();

		await saveGameContestants(
			game.id,
			[
				{ sessionId: session1, name: 'Alice' },
				{ sessionId: session2, name: 'Bob' },
			],
			user.id,
			logger,
		);

		const result = await saveGameContestants(game.id, [{ sessionId: session2, name: 'Bob' }], user.id, logger);

		expect(result).toHaveLength(1);
		expect(result[0].sessionId).toBe(session2);
	});
});

describe('updateContestantScores', () => {
	it('updates scores for existing contestants and returns them', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		const sessionId = crypto.randomUUID();

		await saveGameContestants(game.id, [{ sessionId, name: 'Alice' }], user.id, logger);

		const result = await updateContestantScores(game.id, { [sessionId]: 400 }, user.id, logger);

		expect(result).toHaveLength(1);
		expect(result[0].sessionId).toBe(sessionId);
		expect(result[0].score).toBe(400);
	});

	it('throws when a session ID in the score map has no existing contestant', async () => {
		const user = await createUser('testuser', null, logger);
		const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
		const unknownSessionId = crypto.randomUUID();

		await expect(updateContestantScores(game.id, { [unknownSessionId]: 200 }, user.id, logger)).rejects.toThrow(
			`No existing record found for session ID ${unknownSessionId}`,
		);
	});
});
