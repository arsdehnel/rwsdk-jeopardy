import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { createGame, createUser, getGameById, saveGameContestants } from '@/repositories';
import { resetDb } from '../../../../tests/mocks/db';
import handleScores from '../handle-scores';

// NOTE: These tests WILL FAIL until handle-scores.ts is fully implemented.

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('handleScores.set (integration)', () => {
	it('sets scores for multiple contestants in DB', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const sessionIdAlice = crypto.randomUUID();
		const sessionIdBob = crypto.randomUUID();

		await saveGameContestants(
			game.id,
			[
				{ sessionId: sessionIdAlice, name: 'Alice' },
				{ sessionId: sessionIdBob, name: 'Bob' },
			],
			owner.id,
			logger,
		);

		const scores: Record<string, number> = {
			[sessionIdAlice]: 200,
			[sessionIdBob]: 400,
		};

		await handleScores.set(game.id, scores, logger);

		const updated = await getGameById(game.id, logger);
		const alice = updated.contestants.find(c => c.sessionId === sessionIdAlice);
		const bob = updated.contestants.find(c => c.sessionId === sessionIdBob);
		expect(alice?.score).toBe(200);
		expect(bob?.score).toBe(400);
	});

	it('overwrites scores when called again with updated values', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const sessionIdAlice = crypto.randomUUID();

		await saveGameContestants(game.id, [{ sessionId: sessionIdAlice, name: 'Alice' }], owner.id, logger);

		await handleScores.set(game.id, { [sessionIdAlice]: 200 }, logger);
		await handleScores.set(game.id, { [sessionIdAlice]: 600 }, logger);

		const updated = await getGameById(game.id, logger);
		const alice = updated.contestants.find(c => c.sessionId === sessionIdAlice);
		expect(alice?.score).toBe(600);
	});
});
