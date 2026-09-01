import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { createGame, createUser, updateGame } from '@/repositories';
import { resetDb } from '../../../../tests/mocks/db';
import handleGamePhase from '../handle-game-phase';

const logger = createNoopLogger();
const SYSTEM_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

beforeEach(async () => {
	await resetDb();
});

describe('handleGamePhase.get (integration)', () => {
	it('returns the default SETUP phase for a newly created game', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		const result = await handleGamePhase.get(game.id, logger);

		expect(result).toBe('SETUP');
	});

	it('returns the updated phase after it has been changed in the DB', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		await updateGame(game.id, { phase: 'PLAY' }, SYSTEM_ID, logger);

		const result = await handleGamePhase.get(game.id, logger);

		expect(result).toBe('PLAY');
	});
});
