import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { createGame, createUser, getGameById } from '@/repositories';
import { resetDb } from '../../../../tests/mocks/db';
import handleActiveContestant from '../handle-active-contestant';

// NOTE: These tests WILL FAIL until handle-active-contestant.ts is fully implemented.

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('handleActiveContestant.set (integration)', () => {
	it('sets activeContestantSessionId in DB when called with a session ID string', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const sessionId = crypto.randomUUID();

		await handleActiveContestant.set(game.id, sessionId, logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.activeContestantSessionId).toBe(sessionId);
	});

	it('clears activeContestantSessionId in DB when called with null', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const sessionId = crypto.randomUUID();

		await handleActiveContestant.set(game.id, sessionId, logger);
		await handleActiveContestant.set(game.id, null, logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.activeContestantSessionId).toBeNull();
	});
});
