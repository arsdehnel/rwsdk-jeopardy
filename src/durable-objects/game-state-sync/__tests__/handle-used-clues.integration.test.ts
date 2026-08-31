import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { createGame, createUser, getGameById } from '@/repositories';
import { resetDb } from '../../../../tests/mocks/db';
import handleUsedClues from '../handle-used-clues';

// NOTE: These tests WILL FAIL until handle-used-clues.ts is fully implemented.

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('handleUsedClues.set (integration)', () => {
	it('sets usedClueIds in DB when called with a string array', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const clueIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];

		await handleUsedClues.set(game.id, clueIds, logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.usedClueIds).toEqual(clueIds);
	});

	it('sets usedClueIds to empty when called with an empty array', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		await handleUsedClues.set(game.id, [], logger);

		const updated = await getGameById(game.id, logger);
		const usedClueIds = updated.usedClueIds;
		expect(!usedClueIds || usedClueIds.length === 0).toBe(true);
	});
});
